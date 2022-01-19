# Express Application

## Using express-generator to scaffold out a basic web-server
```
    npm install express-generator -g
    express app_name
    npm install
```


## For creating a secure https server
1. Go to the bin folder of your express application and execute the following commands in sequence to get a self signed certificate for secure https connection
```
    openssl genrsa 1024 > private.key
    openssl req -new -key private.key -out cert.csr
    openssl x509 -req -in cert.csr -signkey private.key -out certificate.pem
```
