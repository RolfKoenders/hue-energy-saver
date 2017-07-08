
# Hue Energy Saver
Do you have a light you sometimes forget to switch off? This simple utility will turn them off for you!

## Run
Run the script with node.
```bash
$ npm i
$ node index.js
```

### Docker
There is a dockerfile if you want to build a docker image yourself.
Run the following inside the project directory to build the image:
```
$ docker build -t hue-energy-saver .
```
And launch it with the following command:
```
$ docker run -d --name save-light hue-energy-saver
```

## Configuration
Configuration can be done by setting environment variables.

| ENV | Description | Required |
|-----|-------------|----------|
| HES_BRIDGE | Hue Bridge Host | ✓ |
| HES_USERNAME | Hue username | ✓ |
| HES_LIGHTNAME | The name of the light you want to save. | ✓ |