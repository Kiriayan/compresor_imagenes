import numpy as np
from PIL import Image
import io

def initialize_centroids(image, K):
    num_pixels = image.shape[0]
    random_indices = np.random.choice(num_pixels, K, replace=False)
    centroids = image[random_indices].astype(np.float64)
    return centroids

def assign_clusters(image, centroids):
    distances = np.linalg.norm(image[:, np.newaxis] - centroids, axis=2)
    closest_centroids = np.argmin(distances, axis=1)
    return closest_centroids

def update_centroids(image, closest_centroids, K):
    new_centroids = np.array([image[closest_centroids == k].mean(axis=0) if np.any(closest_centroids==k) else image[np.random.randint(0, image.shape[0])] for k in range(K)])
    return new_centroids

def k_means(image_flattened, K, max_iters=10, tolerance=1e-4):
    centroids = initialize_centroids(image_flattened, K)
    for _ in range(max_iters):
        closest_centroids = assign_clusters(image_flattened, centroids)
        new_centroids = update_centroids(image_flattened, closest_centroids, K)
        if np.linalg.norm(new_centroids - centroids) < tolerance:
            break
        centroids = new_centroids
    return centroids, closest_centroids

def reconstruct_image(closest_centroids, centroids, original_shape):
    compressed_image = centroids[closest_centroids]
    compressed_image = np.reshape(compressed_image, original_shape)
    return np.clip(compressed_image.astype(np.uint8), 0, 255)

def read_image_bytes(file_bytes):
    image_array = np.array(Image.open(io.BytesIO(file_bytes)).convert("RGB"))
    return image_array

def compress_image_bytes(file_bytes, K):
    image = read_image_bytes(file_bytes)
    original_shape = image.shape
    image_flattened = image.reshape(-1, 3).astype(np.float64)
    centroids, closest_centroids = k_means(image_flattened, K)
    compressed = reconstruct_image(closest_centroids, centroids, original_shape)
    pil_img = Image.fromarray(compressed.astype('uint8'), 'RGB')
    buf = io.BytesIO()
    pil_img.save(buf, format='JPEG', quality=85)
    buf.seek(0)
    return buf.read()