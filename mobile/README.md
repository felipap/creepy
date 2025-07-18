# tracker/mobile

A mobile app that broadcasts the users' location to the server.

## Development

This is an Expo project.

```bash
pnpm install
npx expo start
```

https://github.com/expo/expo/issues/17511

You can use Ngrok to hit your local server from your phone.

## Build deployment version and submit to App Store with Expo

```bash
npx expo prebuild
eas build:configure -p ios
eas build -p ios
eas submit -p ios --latest
```

## Troubleshooting

### In debug, the app can't find or connect to the development server loading on my computer

This may depend on the network situation. I found that I had to pull the phone
camera and use the QR code to connect. And once that happened the app would
reliably find the development server.

Also make sure you're logged in to the Expo in the development-mode iOS app.

## Deployment

...
