FROM python:3.12

WORKDIR /app

COPY . /app

RUN pip install -r requirements.txt

ENV FLASK_APP=app.py

CMD ["sh", "-c", "python -c \"import os,socket,time,sys; host=os.getenv('DATABASE_HOST','jmoney_db'); port=int(os.getenv('DATABASE_PORT','3306')); timeout=int(os.getenv('DB_WAIT_TIMEOUT','60')); start=time.time();\n\nwhile True:\n    try:\n        s=socket.create_connection((host,port),timeout=2); s.close(); break\n    except OSError:\n        if time.time()-start>timeout: sys.exit('Timed out waiting for DB at %s:%s' % (host,port))\n        time.sleep(1)\" && flask run --host=0.0.0.0 --port=5065"]