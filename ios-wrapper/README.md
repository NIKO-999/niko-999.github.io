# Lift for iPhone

A shell around the app, so it can sit in the App Store and use what a web page cannot (widgets, a lock-screen timer, proper notifications). The app is `../lift` and is not changed by anything here.

## One time, on a Mac with Xcode and Node

    cd ios-wrapper
    npm install
    sh build-www.sh
    npx cap add ios
    npx cap sync ios
    npx cap open ios

Then in Xcode: click the **App** target, **Signing & Capabilities**, pick your **Team**, and set the **Bundle Identifier** to your own (it must match `appId` in `capacitor.config.json`). Add a 1024x1024 icon under **Assets > AppIcon**. Plug in your iPhone, turn on Developer Mode (Settings > Privacy & Security), choose it at the top and press **Run**.

## Every time the app changes

    sh build-www.sh && npx cap sync ios

and press Run again.

## The App Store

Product > Archive > Distribute App > App Store Connect, then create the app at appstoreconnect.apple.com, test it through TestFlight and submit it.

## Things to know

- Your workouts live in Safari, not in this app. Use Copy a backup there and Restore here.
- The friends server accepts this app's origin, `capacitor://localhost`.
