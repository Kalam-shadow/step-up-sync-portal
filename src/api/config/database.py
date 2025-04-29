
import os

DB_CONFIG = {
    'host': os.environ.get('DB_HOST', 'localhost'),
    'user': os.environ.get('DB_USER', 'root'),
    'password': os.environ.get('DB_PASSWORD', 'abyss'),
    'database': os.environ.get('DB_NAME', 'step_up_db')
}

