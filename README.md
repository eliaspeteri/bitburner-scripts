# bitburner-scripts

## Table of Contents

1. [Introduction](#introduction)
2. [Buying and selling servers](#buying-and-selling-servers)
3. [Hacking](#hacking)
   1. [foodnstuff.js and n00dles.js](#foodnstuffjs-and-n00dlesjs)
   2. [templates/early-hack-template.ns](#templatesearly-hack-templatens)
   3. [hack.script](#hackscript)
4. [Startup](#startup)
   1. [startup.js](#startupjs)
   2. [run.js](#runjs)
5. [Hacknet](#hacknet)
   1. [hacknet.js](#hacknetjs)
6. [Helper scripts](#helper-scripts)
   1. [backdoor.js](#backdoorjs)
   2. [killall.js](#killalljs)
   3. [root.js](#rootjs)
   4. [servers.js](#serversjs)
   5. [servers.script](#serversscript)

## Introduction

I started playing this open source game called Bitburner, where you hack into fictional networks, and quickly I started writing my own scripts as intended for automating different things in the game. In this repository you'll find some of them. There may or may not be spoilers for the game, so traverse at your own risk.

---

## Buying and selling servers

Purchasing and "selling" servers are handled through the _purchaseServers.js_ and _sellServers.js_ scripts respectively.

**NB**: The act of "selling" servers does not actually give you money back, it just deletes them from your network, allowing you to buy better servers with more RAM.

---

## Hacking

### foodnstuff.js and n00dles.js

These scripts are essentially my first attempt at an automated hacking script.

### templates/early-hack-template.ns

A template script given in the docs, sans edits.

### hack.script

An edited version of the template script, adding dynamic targets as a feature through runtime arguments.

---

## Startup

### startup.js

I use _startup.js_ which kickstarts buying servers, configuring them and running _hack.js_, managing Hacknet nodes with _hacknet.js_, starting custom stats widget and finally launches a monitor program to keep an eye on the current target.

### run.js

Perhaps the most important file to run, is _run.js_, which orchestrates the whole hacking management. This is the file that gets updated the most, though I may or may not split parts of code into separate files.

---

## Hacknet

### hacknet.js

_hacknet.js_ attempts to buy 16 nodes, max them out and when completed, incrementally increases the number of nodes and maxes those out, too. It might be useful to disable this after a while so all the money isn't spent on Hacknet nodes.

---

## Helper scripts

### backdoor.js

This script attempts to install a backdoor on the target server given in the runtime arguments.

**NB**: You need to advance in the story enough to unlock the use of _connect()_ and _installBackdoor()_.

### killall.js

This script attempts to kill all processes on target server given the runtime arguments.

### root.js

_root.js_ will attempt to nuke any available servers, if enough programs are available to open ports for hacking.

### servers.js

Contains a manually compiled array of the currently discovered hostnames, and exports it. Currently not in use, and looking to automate the process of scanning and saving new hostnames into an array.

### servers.script

An NS1 version of _servers.js_.
