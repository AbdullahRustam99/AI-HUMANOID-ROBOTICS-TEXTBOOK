FROM python:3.10

RUN apt-get update && apt-get install -y libgl1 libglib2.0-0

# Create user but stay root during install
RUN useradd -m -u 1000 user

WORKDIR /app

# Install dependencies as root
COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade -r requirements.txt

# Copy app AFTER installing dependencies
COPY . /app

# Switch to non-root user for safety
USER user

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "7860"]
