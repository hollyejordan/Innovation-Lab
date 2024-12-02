import hashlib

def hash_password(password):
    hash_object = hashlib.sha256()
    hash_object.update(password.encode('utf-8'))

    hashed_password = hash_object.hexdigest()

    print(f"Hashed password: {hashed_password}")
    return str(hashed_password)
