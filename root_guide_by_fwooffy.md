# Root Your Meta Quest with Singularity

> **First-time Windows/Linux guide** for **Quest 2 / Quest Pro / Quest 3 / Quest 3S**

This guide starts with a normally set up headset and a Windows or Linux PC. It explains the Meta developer account, USB driver, ADB, the compatibility check, installation, rooting, and a final root test.

> [!IMPORTANT]
> **Guide by Fwooffy.** Project and official documentation were checked on **24 Sep 2026**. Because the project can change quickly, re-check its README and newest release before repeating these steps or updating the headset.

## Table of contents

- [What you need](#what-you-need)
- [Read this before you start](#read-this-before-you-start)
- [1. Set up Developer Mode](#1-set-up-developer-mode)
- [2a. Install ADB on Windows](#2a-install-adb-on-windows)
- [2b. Install ADB on Linux](#2b-install-adb-on-linux)
- [3. Connect and check your build](#3-connect-and-check-your-build)
- [4. Install Singularity](#4-install-singularity)
- [5. Set up Wireless ADB](#5-set-up-wireless-adb)
- [6. Verify root and troubleshoot](#6-verify-root-and-troubleshoot)
- [Useful links and notes](#useful-links-and-notes)
  - [Project](#project)
  - [Official Meta setup](#official-meta-setup)
  - [Official Android tools](#official-android-tools)
  - [Scope of this guide](#scope-of-this-guide)
- [Credits and source policy](#credits-and-source-policy)

## What you need

- A Quest already paired to the Meta Horizon phone app
- A Windows 10/11 or Linux PC, internet, and a USB-C cable that carries data
- Your Meta account and enough time to finish without rushing
- A backup of photos, recordings, and anything you cannot replace
- A charged headset; keep it powered during the root process

## Read this before you start

> [!CAUTION]
> Root gives apps administrator-level access. Singularity is an experimental, third-party exploit and may cause crashes or data loss. A system update can change whether it works. **Do not install or press Root Now until your exact headset and firmware build are confirmed by the current project information.**

---

## 1. Set up Developer Mode

Developer Mode lets your PC install apps outside the Meta Horizon Store. Use the same Meta account on the headset, phone app, and developer dashboard.

### 1. Finish normal headset setup

If the headset is new or reset, complete its normal on-screen setup. Install the Meta Horizon app on your phone, sign in, and pair the headset there.

### 2. Create your developer account

Open [developers.meta.com/horizon/sign-up/](https://developers.meta.com/horizon/sign-up/) in a browser and sign in with your Meta account. Create or join a developer team if the dashboard asks. You do not need to create a Quest app for this guide.

### 3. Verify the account

Open the dashboard's **Verification** page and finish the offered account verification method. Meta's current setup page lists a mobile number for SMS two-factor verification or a payment method. Complete any team requirements shown by Meta.

### 4. Turn on Developer Mode

On your phone, follow this path:

**Meta Horizon app > headset icon > your paired headset > Headset Settings > Developer Mode > On**

### 5. Turn on the USB notification

In the headset, follow this path:

**Quick Control / Quick Settings > Settings (gear) > Developer > MTP Notification > On**

The USB debugging prompt appears when you connect the PC in [Step 3](#3-connect-and-check-your-build).

> [!NOTE]
> **If the toggle is missing:** Check that you joined a developer team, finished account verification, are using the same Meta account in the phone app, and paired the correct headset. Meta also requires eligible developers to be at least 18.

Official setup: Meta's **Device Setup** and **Test your app on your device** pages are linked in [Useful links and notes](#useful-links-and-notes).

---

## 2a. Install ADB on Windows

ADB (Android Debug Bridge) is the small command-line tool that talks to your Quest. You only need Google's Platform Tools package, not Android Studio.

### A. Install the Meta USB driver

#### 1. Download the Oculus ADB Drivers

From Meta's official **Oculus ADB Drivers** page, click **Download**. This driver is for Windows so the PC can recognize your Quest for ADB. [Open the Meta download page.](https://developers.meta.com/horizon/downloads/package/oculus-adb-drivers/)

#### 2. Unzip and install the driver

In File Explorer, right-click the downloaded ZIP and choose **Extract All**. Open the extracted folder, right-click **`android_winusb.inf`**, and choose **Install**. Approve the Windows prompt if one appears.

### B. Install Google's Platform Tools

#### 3. Download the Windows ZIP

Open Google's **SDK Platform Tools** page. Choose the Windows download, accept the license if prompted, and save the ZIP. [Open the Google download page.](https://developer.android.com/tools/releases/platform-tools)

#### 4. Extract the `platform-tools` folder

Right-click the ZIP and choose **Extract All**. Open the resulting **`platform-tools`** folder. You should see **`adb.exe`** inside. Move this folder somewhere easy to keep, such as Documents.

#### 5. Open Command Prompt in that folder

Click File Explorer's address bar while inside **`platform-tools`**, type **`cmd`**, and press Enter. A black Command Prompt window opens at that folder. Keep it open for the remaining commands.

```shell
adb version
```

> **Expected:** A line beginning `Android Debug Bridge version`.

> [!TIP]
> **If `adb` is not recognized:** The Command Prompt probably opened in the wrong folder. Reopen the folder that contains `adb.exe`, click its address bar, type `cmd`, and try again.

---

## 2b. Install ADB on Linux

ADB (Android Debug Bridge) is the small command-line tool that talks to your Quest.  
Meta/Oculus ADB drivers are Windows-only and not required on Linux. Android USB communication is supported natively by the Linux kernel.

### 1. Install ADB via your package manager or manually

Inside your terminal, run your package manager command to install the Android toolkit:

- **Arch / CachyOS:** `sudo pacman -S android-tools`
- **Debian / Ubuntu:** `sudo apt update && sudo apt install android-tools-adb`
- **Fedora:** `sudo dnf install android-tools`
- **openSUSE:** `sudo zypper install android-tools`

> [!TIP]
> **Manual Option:** If you prefer to install the tools manually, open [Google's SDK Platform Tools](https://developer.android.com/tools/releases/platform-tools) page. Choose the Linux download, accept the license if prompted, and save the ZIP. Extract this ZIP to somewhere accessible via your terminal. If you use this method, open that directory in your terminal and prefix `./` to the start of ADB commands in this guide (for example: `./adb devices`).

### 2. Install system udev rules & permissions

Linux restricts raw USB access by default. Setting up udev rules permits non-root users to communicate with the Quest over USB.

#### Install the udev rules for your distro:
- **Arch / CachyOS:** `sudo pacman -S android-udev-rules`
- **Debian / Ubuntu:** `sudo apt install android-sdk-platform-tools-common`
- **Fedora & openSUSE:** *Skipped — udev rules are included automatically when you install `android-tools` in Step 1.*

#### Apply hardware permissions:
1. Add your user account to the hardware permission groups:
   ```shell
   sudo usermod -aG adbusers,plugdev $USER

2. Reload udev rules to apply changes immediately:
   ```shell
   sudo udevadm control --reload-rules && sudo udevadm trigger

3. Log out and back in (or run ``newgrp adbusers`` in your current terminal) for group membership changes to take effect.

### 3. Verify ADB installation

Confirm that ADB is installed and functional with ``adb version``.

Expected output: A response starting with Android Debug Bridge version.

>[!TIP]
> If adb devices shows no permissions or fails later: Unplug/replug the USB cable and restart the ADB daemon with ``adb kill-server && adb start-server``.

---

## 3. Connect and check your build

> [!WARNING]
> This compatibility check is mandatory.

### 1. Connect the Quest

Use a USB-C **data** cable from the headset to the PC. Put on the headset. At **Allow USB debugging?**, choose **Always allow from this computer**, then **Allow**.

```shell
adb devices
```

> **Expected:** One serial number with the word `device`.

Example:

```text
1WMHH123456789 device
```

If it says `unauthorized`, approve the prompt inside the headset. If the list is empty, use [Quick fixes](#quick-fixes).

### 2. Read the exact firmware build

Keep the headset connected. Run the command below and write down the number it prints. This is the **incremental build** used by the project to report confirmed firmware.

```shell
adb shell getprop ro.build.version.incremental
```

### Project's confirmed latest builds on 24 Sep 2026

| Headset | Project name | Incremental build |
|---|---|---:|
| Quest Pro | Seacliff | `51503870024400340` |
| Quest 3 | Eureka | `52433670036000520` |
| Quest 3S | Panther | `3814840024700610` |
| Quest 2 | Hollywood | `52242990024200150` |

> [!CAUTION]
> **Stop before installing.** These numbers are a dated snapshot, not a guarantee for other builds. Open the live Singularity README and release notes. For this beginner path, continue only when your exact model and build are confirmed there or by the maintainer. **Do not assume a newer build works because an older one did.**

Quest 1 and other variants have separate or less documented setup; do not use the shared **Root Now** steps below for them without current model-specific instructions.

---

## 4. Install Singularity

Continue only after the [compatibility check](#3-connect-and-check-your-build). Leave the ADB Command Prompt open and the headset connected unless Singularity tells you otherwise.

### 1. Download the APK from GitHub Releases

[Open the Singularity releases list.](https://github.com/Lumince/singularity/releases) Choose the newest visible release, expand **Assets**, and download its Singularity **`.apk`** file. The auto-generated **Source code** ZIP is not the installer.

### 2. Put the APK beside `adb.exe`

Move the APK into your **`platform-tools`** folder. In File Explorer, turn on **View > Show > File name extensions**, then rename it exactly **`Singularity.apk`**. Check that it did not become **`Singularity.apk.apk`**.

Install the APK on your Quest device with:
```shell
adb install -g Singularity.apk
```

> [!TIP]
> **If using Linux:** 
> - **Package Manager install:** ADB runs system-wide. Open your terminal in the folder containing the APK (e.g., `cd ~/Downloads`) and run `adb install -g Singularity.apk`.
> - **Manual ZIP download:** Move the APK into your extracted `platform-tools` folder, open your terminal inside that folder, and run `./adb install -g Singularity.apk`.

> **Expected:** `Success`. The `-g` flag grants permissions Singularity needs.

### 3. Open it in the headset

Open **Library > Unknown Sources > Singularity**. If **Root on Boot** is offered, leave it off for the first root. Keep the headset on Wi-Fi.

### Start Wireless ADB setup

#### 4. Keep Wi-Fi on and the headset awake

Make sure the headset is connected to Wi-Fi. Leave the USB cable connected while you complete setup unless the app tells you to unplug it.

#### 5. Tap Setup Wireless ADB

Tap **Setup Wireless ADB** in Singularity and follow its in-app guide in order. The `-g` install flag grants the permission the project says it needs to enable Wireless ADB.

> [!CAUTION]
> **Continue with Step 5, but do not press Root Now yet.** Complete the permission or pairing prompts and confirm the in-app Wireless ADB connection first.

---

## 5. Set up Wireless ADB

Continue from [Step 4](#4-install-singularity) inside Singularity. A working USB connection in the Windows `adb devices` list does not by itself finish the app's Wireless ADB setup.

### 6. Complete permission or pairing prompts

If a Wireless debugging screen opens, turn it on and approve the current Wi-Fi network if asked. If Singularity asks for a pairing code, choose **Pair device with pairing code** in the system screen and enter its current six-digit code into Singularity. A code can expire; generate a fresh one if pairing fails.

### 7. Wait for the in-app connection to succeed

Return to Singularity and wait for its Wireless ADB setup to report success or connected status. The exact screens can vary by app and firmware version; use the current on-screen guide for the final confirmation. **Do not continue while it reports disconnected or setup incomplete.**

> [!TIP]
> **If Wireless ADB does not connect:** Check that Quest Wi-Fi and Meta Developer Mode are on. Confirm that `adb install -g Singularity.apk` returned `Success`. Close and reopen Singularity, retry its setup, then restart the headset if needed. If the app's prompts differ, follow its current guide and release notes rather than guessing at hidden Android settings.

### Only after Wireless ADB is ready

#### 8. Press Root Now

Press **Root Now** and let the app finish. If it reports failure and offers **Retry** or **Root Now** again, you may retry a few times. If failures continue, fully power off the headset, power it on, and check the current release notes before trying again.

> [!WARNING]
> **After a successful soft reboot:** A successful root should trigger a soft reboot. **Do not press Root Now again after that success.** Continue to [Step 6](#6-verify-root-and-troubleshoot) to grant Singularity root access and verify it from your PC.

---

## 6. Verify root and troubleshoot

### 1. Grant Singularity root access

After the soft reboot, open **Library > Unknown Sources > Singularity-Magisk**. In **Superuser**, grant or enable access for **Singularity** if it is not already granted. Fully close Singularity and reopen it.

### 2. Confirm ADB still sees the headset

Reconnect the USB cable if needed. Put on the headset and approve any new USB debugging prompt. The command should show one serial number ending in `device`.

```shell
adb devices
```

### 3. Test the root shell

Run the command below. If Singularity-Magisk asks whether **Shell** or **ADB** may use root, tap **Grant**, then run it again.

```shell
adb shell su -c id
```

> **Success:** The result contains `uid=0(root)`. Anything else is not a confirmed root test.

### Quick fixes

| Problem | Fix |
|---|---|
| **No device listed** | Try another data cable or USB port; check Developer Mode and the Meta driver; run `adb kill-server`, then `adb devices`. |
| **`unauthorized`** | Put on the headset and approve **Allow USB debugging**. Reconnect the cable if the prompt is hidden. |
| **More than one device** | Disconnect extra phones/headsets or wireless ADB sessions, then run `adb devices` again. |
| **No Magisk app / no `uid=0`** | Do not assume success. Check the app's status and the latest project release notes; avoid repeating **Root Now** after a reported success. |

> [!CAUTION]
> **Keep the first root simple.** Do not install random Magisk modules or phone-focused Android tweaks immediately. Root-level changes can disrupt Horizon OS or controller behavior. Check project release notes before any system update.

---

## Useful links and notes

> **Reference - return to this page later.** The links below are clickable. The project can change quickly, so re-check its README and newest release before you repeat these steps or update the headset.

### Project

#### [Singularity README](https://github.com/Lumince/singularity)

Supported models, current usage steps, and confirmed builds.

#### [Download Singularity APK (choose newest release)](https://github.com/Lumince/singularity/releases)

<https://github.com/Lumince/singularity/releases>

#### [Project setup wiki](https://github.com/Lumince/singularity/wiki/Install-%26-Setup-Guide)

Includes a separate Quest 1 path; some main-path UI details are older.

### Official Meta setup

#### [Meta developer sign-up](https://developers.meta.com/horizon/sign-up/)

Start the developer account.

#### [Meta Device Setup](https://developers.meta.com/horizon/documentation/native/android/mobile-device-setup/)

Developer team, account verification, Developer Mode, Windows driver.

#### [Meta developer mode walkthrough](https://developers.meta.com/horizon/documentation/android-apps/enable-developer-mode/)

Phone-app path, MTP notification, USB debugging, Unknown Sources.

#### [Download Meta Oculus ADB Drivers](https://developers.meta.com/horizon/downloads/package/oculus-adb-drivers/)

<https://developers.meta.com/horizon/downloads/package/oculus-adb-drivers/>

### Official Android tools

#### [Download Google SDK Platform Tools](https://developer.android.com/tools/releases/platform-tools)

<https://developer.android.com/tools/releases/platform-tools>

#### [Android device connection help](https://developer.android.com/studio/run/device)

ADB devices and USB debugging troubleshooting.

#### [Android wireless debugging](https://developer.android.com/tools/adb)

Wireless debugging and pairing code concepts.

### Scope of this guide

> [!NOTE]
> This is a Windows first-install walkthrough for Quest 2, Quest Pro, Quest 3, and Quest 3S. The project release notes mention Quest 1 and Quest 3S Xbox Edition, but their applicability and setup should be checked separately with the current maintainer instructions. Nothing here proves a particular headset will root successfully.

## Credits and source policy

This beginner-friendly guide was originally created by **Fwooffy**. It was developed from an earlier outline and checked against the project and official documentation linked above. Where that earlier material conflicted with current project or official documentation, this guide follows the linked sources.

Linux instructions added by otter_oasis.
