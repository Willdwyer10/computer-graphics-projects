#
# .obj to .js converter helper for UW Madison CS559
# Copyright 2023 Eric Brandt & Sangeetha Grama Srinivasan
#
import itertools
import sys
import time
from datetime import datetime
import os
import re
import math
import argparse


def read_obj(file):
    # read an obj file and return a dictionary of v, vn, vt, and f elements
    def parsev(toks, qty):
        f = [float(t) for t in toks]
        while len(f) < qty:
            f.append(0.0)
        return tuple(f[0:qty])

    def splitn(str, s, n):
        ret = str.split(s)
        ret.extend([''] * n)
        return ret[0:n]

    def adjust_idx(f, obj):
        f = [int(i) if (type(i) is str and len(i) > 0) else None for i in f]
        if type(f[0]) is int:
            f[0] = f[0] - 1 if f[0] > 0 else len(obj['v']) + f[0]
        if type(f[1]) is int:
            f[1] = f[1] - 1 if f[1] > 0 else len(obj['vt']) + f[1]
        if type(f[2]) is int:
            f[2] = f[2] - 1 if f[2] > 0 else len(obj['vn']) + f[2]
        return tuple(f)

    def parsef(toks, obj):
        # in: list of n strings like:
        #   ['1', '2', '3'] or ['1/2/3', '4/5/6', ...] or ['1//2', '3//4', ...] or ['-1/-2/-3', '-4/-5/-6' ...] or variants thereof
        # out: list of 3-tuples
        sp = [splitn(s, '/', 3) for s in toks]
        v = [adjust_idx(n, ret) for n in sp]
        # split an n-vertex polygon face into n-2 triangles
        return [[v[0], v[i-1], v[i]] for i in range(2, len(v))]

    def calc_vertex_normal(tri, obj, vn_to_idx):

        p1 = obj['v'][tri[0][0]]
        p2 = obj['v'][tri[1][0]]
        p3 = obj['v'][tri[2][0]]

        v1 = [p2[i]-p1[i] for i in range(3)]
        v2 = [p3[i]-p1[i] for i in range(3)]

        # cross product:
        nx = v1[1]*v2[2]-v1[2]*v2[1]
        ny = v1[2]*v2[0]-v1[0]*v2[2]
        nz = v1[0]*v2[1]-v1[1]*v2[0]

        # normalize
        l = math.sqrt(nx*nx+ny*ny+nz*nz)
        vn = (nx / l, ny / l, nz / l) if l != 0 else (0.0, 0.0, 0.0)

        if vn in vn_to_idx:
            idx = vn_to_idx[vn]
        else:
            idx = len(obj['vn'])
            vn_to_idx[vn] = idx
            obj['vn'].append(vn)
        return tuple([(i[0], i[1], idx) for i in tri])

    vert_idx = 0
    verts_to_idx = {}
    idx_to_verts = {}

    with open(file, 'r') as fil:
        ret = {'v': [], 'vt': [], 'vn': [], 'fname': file}
        tri_indices = []
        creating_normals = None
        vn_to_idx = {}

        for line in fil:
            tok = line.split()

            if len(tok) >= 1:
                if tok[0] == 'v':
                    ret['v'].append(parsev(tok[1:], 3))
                if tok[0] == 'vt':
                    ret['vt'].append(parsev(tok[1:], 2))
                if tok[0] == 'vn':
                    ret['vn'].append(parsev(tok[1:], 3))
                if tok[0] == 'f':
                    creating_normals = (
                        len(ret['vn']) == 0) if creating_normals is None else creating_normals
                    face_tris = parsef(tok[1:], ret)
                    for tri in face_tris:
                        if creating_normals:
                            tri = calc_vertex_normal(tri, ret, vn_to_idx)
                        for t in tri:
                            if t not in verts_to_idx:
                                verts_to_idx[t] = vert_idx
                                idx_to_verts[vert_idx] = t
                                tri_indices.append(vert_idx)
                                vert_idx += 1
                            else:
                                tri_indices.append(verts_to_idx[t])

    ret['tris'] = tri_indices
    ret['idx_to_verts'] = idx_to_verts

    return ret


def gather_stats(obj):
    # gather statistics on the obj dictionary and return a stats dictionary
    stats = {}
    stats['unique vertex positions'] = len(obj['v'])
    stats['unique vertex normals'] = len(
        obj['vn']) if None not in obj['vn'] else 0
    stats['unique vertex tex coords'] = len(
        obj['vt'])
    stats['total vertices'] = len(obj['idx_to_verts'])
    stats['total normals'] = len(obj['idx_to_verts'])
    stats['total tex coords'] = len(
        obj['idx_to_verts']) if len(obj['vt']) > 0 else 0
    stats['triangles'] = len(obj['tris']) // 3
    bb_min = [sys.float_info.max] * 3
    bb_max = [-sys.float_info.max] * 3
    for v in obj['v']:
        for i in range(3):
            bb_min[i] = min(bb_min[i], v[i])
            bb_max[i] = max(bb_max[i], v[i])
    stats['bb_min'] = bb_min
    stats['bb_max'] = bb_max
    return stats


def write_js(file, obj, model_name, stats):
    # write the obj dictionary to a javascript file

    def write_point_list(f, obj, nm, ord, comment, var_name):
        d = obj['idx_to_verts']

        f.write(f'// {comment}\n')
        f.write(f'{var_name} = new Float32Array([')
        num_verts = len(d)
        for tidx in range(len(d)):
            vidx = d[tidx][ord]
            s = ', '.join([str(i) for i in obj[nm][vidx]])
            f.write(' ' + s)
            f.write(',' if tidx != num_verts - 1 else ']);\n\n')

    def check_all_vt_present(obj):
        for idx in obj['idx_to_verts']:
            vt_idx = obj['idx_to_verts'][idx]
            if vt_idx[1] is None or vt_idx[1] >= len(obj['vt']):
                return False
        return True

    with open(file, 'w') as f:
        try:
            username = os.getlogin()
        except:
            username = '<unknown>'

        # write some comments at the beginning
        f.write(
            f"// Autogenerated with obj_to_js.py from {obj['fname']} at {datetime.now()} by {username}\n")
        f.write(
            f"// See https://github.com/elbrandt/ObjToJs for more info\n\n")
        for stat in stats:
            f.write(f'// {stat:25}: {stats[stat]}\n')
        f.write('\n')
        if len(obj['idx_to_verts']) < (1 << 8):
            dtype = 'Uint8Array'
        elif len(obj['idx_to_verts']) < (1 << 16):
            dtype = 'Uint16Array'
        else:
            dtype = 'Uint32Array'
        f.write('// {:25}: {}\n'.format('triangleIndices type', dtype))

        # the object
        f.write('// the object\n')
        f.write(f'var {model_name} = new Object();\n\n')

        # write bounding box properties
        f.write('// aligned bounding box extents\n')
        f.write(
            f"{model_name}.bboxMin = new Float32Array({stats['bb_min']});\n")
        f.write(
            f"{model_name}.bboxMax = new Float32Array({stats['bb_max']});\n\n")

        # Write triangle element index array
        f.write('// element index array\n')
        f.write(f'{model_name}.triangleIndices = new {dtype}([')
        assert (len(obj['tris']) % 3 == 0)
        f.write(', '.join([str(i) for i in obj['tris']]))
        f.write(']);\n\n')

        # write list of vertex positions
        write_point_list(f, obj, 'v', 0, 'vertex positions',
                         f'{model_name}.vertexPos')

        # write list of vertex normals
        write_point_list(f, obj, 'vn', 2, 'vertex normals',
                         f'{model_name}.vertexNormals')

        # write list of vertex texture coordinates (if we have them)
        if len(obj['vt']) > 0 and check_all_vt_present(obj):
            write_point_list(
                f, obj, 'vt', 1, 'vertex texture coordinates', f'{model_name}.vertexTextureCoords')
        else:
            print('\nNOTE: Skipping writing vertex texture coordinates to .js because they were not present (or incomplete) in .obj file.')


def obj_to_js(obj_fil_in, js_fil_out, model_name):
    print(
        f"\nTranslating '{obj_fil_in}' to '{js_fil_out}'...")

    # give the model a default name if one is not provided
    if model_name is None or len(model_name) == 0:
        model_name = 'my_model'

    # ensure model_name is a valid javascript variable name, replace invalid chars with _
    # (note: doesn't check for javascript keywords)
    model_name_fix = re.sub(r'^[^a-zA-Z_$]|[^\w$]', '', model_name)
    if model_name_fix != model_name:
        model_name_fix = 'my_model' if len(
            model_name_fix) == 0 else model_name_fix
        print(
            f"\nNOTE: adjusting invalid model object name '{model_name}' to '{model_name_fix}'")
        model_name = model_name_fix

    # do it
    tm_start = time.time()
    obj_data = read_obj(obj_fil_in)
    stats = gather_stats(obj_data)
    write_js(js_fil_out, obj_data, model_name, stats)
    tm_finish = time.time()

    # print some final stats
    print('Stats:')
    for stat in stats:
        print(f'\t{stat:25}: {stats[stat]}')
    print(
        f"\nTranslated '{obj_fil_in}' to model '{model_name}' in '{js_fil_out}' in {tm_finish-tm_start:0.3f} sec.")


def main():
    parser = argparse.ArgumentParser(
        prog='Obj to Js Converter',
        description='Helpful Utility for UW Madison CS559 webgl assignments',
        epilog='Additional info available at https://github.com/elbrandt/ObjToJs'
    )
    parser.add_argument('in_file', type=str,
                        help='input .obj file')
    parser.add_argument('out_file', type=str, nargs='?',
                        help='output .js file')
    parser.add_argument('model_name', type=str, nargs='?', default='my_model',
                        help='model name for variable in js')
    args = parser.parse_args()

    if not os.path.isfile(args.in_file):
        raise RuntimeError(f"input file {args['in_file']} not found")
    if args.out_file is None:
        args.out_file = os.path.splitext(args.in_file)[0] + '.js'
    obj_to_js(args.in_file, args.out_file, args.model_name)


if __name__ == '__main__':
    main()