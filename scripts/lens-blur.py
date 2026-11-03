# True lens (disc) blur in linear light, premultiplied alpha; small WebP out.
import sys, os, glob, json
import numpy as np
from PIL import Image
src, dst = sys.argv[1], sys.argv[2]
keys = json.load(open(os.path.join(src, 'keys.json')))
os.makedirs(dst, exist_ok=True)
for f in glob.glob(os.path.join(dst, '*.webp')):
    if os.path.basename(f)[:-5] not in keys: os.remove(f)
W, H, R = 512, 320, 4.4
n = int(np.ceil(R)) + 1
yy, xx = np.mgrid[-n:n + 1, -n:n + 1]
K = np.clip(R + 0.5 - np.sqrt(xx * xx + yy * yy), 0, 1).astype(np.float32); K /= K.sum()
def conv(img):
    kh, kw = K.shape; ph, pw = kh // 2, kw // 2
    Hh, Ww = img.shape[0] + 2 * ph, img.shape[1] + 2 * pw
    pad = np.zeros((Hh, Ww, img.shape[2]), np.float32); pad[ph:ph + img.shape[0], pw:pw + img.shape[1]] = img
    kk = np.zeros((Hh, Ww), np.float32); kk[:kh, :kw] = K; kk = np.roll(kk, (-ph, -pw), axis=(0, 1))
    out = np.fft.irfft2(np.fft.rfft2(pad, axes=(0, 1)) * np.fft.rfft2(kk)[..., None], s=(Hh, Ww), axes=(0, 1))
    return out[ph:ph + img.shape[0], pw:pw + img.shape[1]]
for key in keys:
    im = Image.open(os.path.join(src, key + '.png')).convert('RGBA').convert('RGBa').resize((W, H), Image.LANCZOS).convert('RGBA')
    a = np.asarray(im).astype(np.float32) / 255
    al = a[..., 3:4]; lin = np.power(a[..., :3], 2.2) * al
    b = conv(np.concatenate([lin, al], axis=2))
    al2 = np.clip(b[..., 3:4], 0, 1)
    rgb = np.power(np.clip(b[..., :3] / np.maximum(al2, 1e-4), 0, 1), 1 / 2.2)
    out = (np.concatenate([rgb, al2], axis=2) * 255 + 0.5).astype(np.uint8)
    Image.fromarray(out, 'RGBA').save(os.path.join(dst, key + '.webp'), 'WEBP', quality=74, method=6)
print('lens-blurred', len(keys), 'total KB', sum(os.path.getsize(f) for f in glob.glob(os.path.join(dst, '*.webp'))) // 1024)
