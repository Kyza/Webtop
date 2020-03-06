<h1 align="center">
 Webtop
</h1>
<p align="center">
 Easily build your own desktop using NodeJS and Electron.
 <hr>
 <img src="images/TeQSwA.gif" />
</p>
<hr>

# What is this?

Webtop is the **Windows 10 only** solution to the ugly default Windows desktop--and by `default` I mean `only`.

[Windows themes](https://www.deviantart.com/tag/windows10themes) come with a multitude of problems.

 - It's time consuming to install them.
 - Some they require paid apps for the full experience.
 - They need to be updated when Microsoft changes things.
 - Making them is a hassle, and Googling tutorials only gets you tutorials for default Windows themes like [this](https://www.laptopmag.com/articles/make-windows-10-theme). Rather than tutorials to create [what you're actually looking for](https://www.deviantart.com/tag/windows10themes).

Webtop has advantages over these problems.

 - Since both Webtop and the desktop modules are created using NodeJS and Electron, programatical functionality can be added easily.
 - **[Planned Feature]** You can set a different desktop for each monitor.
 - It's very easy to install new desktops. Just drag them into your [desktops](https://github.com/KyzaGitHub/Webtop/tree/master/desktops) folder, change the desktop setting in your `config.json` file (`config.json` hasn't been implemented yet, change [this line](https://github.com/KyzaGitHub/Webtop/blob/7a18466b66af857908a98b0a7c5827696cda4c1a/index.js#L38) to point to the folder instead), and restart Webtop.

# How do I make one?

There is no documentation yet.

Take a look at the [AnimeJS](https://github.com/KyzaGitHub/Webtop/tree/master/desktops/AnimeJS) example desktop.

Change [this line](https://github.com/KyzaGitHub/Webtop/blob/7a18466b66af857908a98b0a7c5827696cda4c1a/index.js#L38) to point to the folder inside of [desktops](https://github.com/KyzaGitHub/Webtop/tree/master/desktops) that contains your desktop so that Webtop will load it.

# How do I run it?

Git and NodeJS are required to run Webtop.

Download/update Webtop.

```ruby
git clone https://github.com/KyzaGitHub/Webtop.git
```

As a first time setup for whenever you update Webtop, install the required `npm` packages.

```ruby
npm i
```

You are now ready to run Webtop.

```ruby
npm start --verbose
```

Provided that you haven't changed anything, this will run the [AnimeJS](https://github.com/KyzaGitHub/Webtop/tree/master/desktops/AnimeJS) example desktop on your primary monitor. 

Closing the desktop will restore the default Windows taskbar.

# Why does Webtop only work on Windows 10?

Webtop only works on Windows 10 because there's no point to having this on Linux, and I don't have a macOS system to test anything on.

# Known problems.

 - There's no _easy_ way to index files for replicating the Windows Start Menu search feature yet.
 - If the first window that is opened using `node-window-manager` was maximized, it restores it down.
 - Minimizing windows makes you lose them. This can be counteracted for now by restoring them.
 - Windows that get moved to the hidden icon tray on the default taskbar--such as Discord when you close it--makes you lose them.
 - The program closes after a while with the `ELIFECYCLE` for unknown reasons.
   - Possibly due to a memory leak or other problem in the `node-window-manager` package. 
