# Build Lift for iPhone without a Mac

GitHub has Macs with the newest Xcode. The workflow `.github/workflows/ios-testflight.yml` builds the app on one and sends it to TestFlight. You set it up once, from a browser.

## 1. Choose the app's ID

Pick a name that is yours, like `com.nikorapullin.lift`. Lowercase, dots, no spaces. Use it everywhere below as the **Bundle ID**.

## 2. Register it and make the app (appstoreconnect.apple.com)

1. Go to **developer.apple.com/account > Certificates, IDs & Profiles > Identifiers > +** and register an **App ID** (type App). Put your Bundle ID in. Save.
2. Go to **appstoreconnect.apple.com > Apps > + > New App**. Platform iOS, name **Lift** (if it is taken, try "Lift Workout Log"), language English, pick your Bundle ID, any SKU (for example `lift1`). Create.

## 3. Make an API key

1. In App Store Connect: **Users and Access > Integrations > App Store Connect API > Team Keys > +**.
2. Name it `github`, access **Admin**. Create.
3. Download the `.p8` file. **You can download it once only.** Keep it.
4. Write down the **Key ID** (next to the key) and the **Issuer ID** (at the top of the page).

## 4. Find your Team ID

**developer.apple.com/account > Membership details > Team ID** (ten letters and numbers).

## 5. Put five secrets in GitHub

In the repo on github.com: **Settings > Secrets and variables > Actions > New repository secret**. Add these, one at a time:

| Name | Value |
|---|---|
| `BUNDLE_ID` | your Bundle ID |
| `APPLE_TEAM_ID` | your Team ID |
| `APPSTORE_KEY_ID` | the Key ID |
| `APPSTORE_ISSUER_ID` | the Issuer ID |
| `APPSTORE_KEY_P8` | open the `.p8` file in any text editor and paste **everything** in it, including the BEGIN and END lines |

## 6. Run it

**Actions** tab > **Lift for iPhone (TestFlight)** > **Run workflow**. It takes about 10 to 15 minutes. If it goes red, open the run, copy the red lines and send them to me.

## 7. Install it on your phone

When it finishes, App Store Connect > your app > **TestFlight** shows the build after a few minutes of processing. Add yourself under **Internal Testing**, install the **TestFlight** app from the App Store on your iPhone, and the build is there.

## Things to know

- Each run makes a new build number on its own.
- Your workouts live in Safari, not in this app: use Copy a backup there and Restore here.
- To send the app to everyone, submit a TestFlight build for review from App Store Connect, after adding screenshots and a privacy policy.
