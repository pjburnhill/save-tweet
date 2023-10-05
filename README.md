# save-tweet
A chrome extension for adding a button on twitter.com under tweets to capture/save it as a screenshot, using Chrome.debugger.

## Preview

What the button looks like on Twitter.com:

![Save Tweet button preview](/screenshots/button-preview.png)

Output:

![Output preview](/screenshots/twitter_com_NASA_status_1709293676478833034.png)

## Install

You can load this extension to Chrome as unpacked:

1. Open your Chrome Extensions page: [chrome://extensions/](chrome://extensions/)
1. Enable 'Developer mode' (top right)
1. Click 'Load unpacked' and select this source folder.

## Security Warning and Disclaimer

This extension makes use of the chrome.debugger API to capture screenshots of tweets. Please be aware that using debugging capabilities on websites can pose security risks, especially if misused or if the extension is granted these privileges on malicious sites. Always be cautious and understand the implications of using debugger features in extensions. By using this extension, you do so at your own risk.

I, PJ, am not responsible for any damages, issues, or security breaches that may arise from using this extension. Ensure you trust the sites you're debugging and always keep your software up to date.

See the [Privacy Policy](privacy_policy.txt) for details of data collection (spoiler: none!).

## Todo

- Options for
  - [ ] Selecting elements to remove before capture
  - [ ] Scale factor
