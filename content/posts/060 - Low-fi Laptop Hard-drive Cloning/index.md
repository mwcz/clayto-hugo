---
title: "Low-tech Disk Cloning"
date: 2019-05-31T14:17:57-04:00
Tags:
 - linux
 - fedora
description: "Using dd and netcat to clone a disk over your local network."
aliases:
 - /2019/05/low-fi-laptop-disk-cloning/
 - /2019/05/low-tech-laptop-disk-cloning/
thumbnail: thumb.jpg
mwc: 60
---

It's a tale as old as time.  A nice laptop.  A nearby cold beverage.  A sickening splash.  Thanks to the solid seals on the [Carbon](https://en.wikipedia.org/wiki/ThinkPad_X1_Carbon#2018_%E2%80%93_6th_generation), there was no permanent damage, just a very sticky, nearly unusable keyboard.  Rather than clean or replace the keyboard, our support desk opted to issue a new laptop.

That's how I found myself with two identical laptops, one whose SSD had a fully configured OS, and the other with an empty SSD in need of such an OS.

![image of two X1 Carbon laptops]( ./we-lenovo-thinkpad-x1-carbon-2017-feature1.webp )

To get the source disk's data onto the destination disk as quickly as possible, I wanted to do a quick and dirty clone without having to learn how to use a new tool, without having to find a large disk to store an intermediary copy of the disk image, and without taking hours and hours to transfer.  With the help of a few StackOverflow posts, I settled on the following solution which makes use of two [Fedora](https://getfedora.org/) live USB drives, `dd` and `netcat`.

---

## Step 0. Preliminary notes

The first thing to note is that this method is not secure (it's unencrypted) and is meant to be used on a private local network only.

These steps are unlikely to work if the hardware is not identical.  If the destination disk is even a little bit smaller, things are likely to fail catastrophically.  And if it's larger, you won't have access to that extra space unless you resize your partitions after the image is transferred.

I bear no responsibility for the outcome of these instructions.

I make mistakes.  Please read and understand the steps before running any of them.

I wrote this mostly as a note-to-self, but if it helps someone out, great!

One other thing before moving on. A wired network is *far superior* to wireless for what's coming next.

---

## Step 1. Live OS on both machines

First, grab two USB thumb drives, [put a Fedora live system](https://docs.fedoraproject.org/en-US/fedora/f30/install-guide/install/Preparing_for_Installation/#sect-preparing-boot-media) on them, and boot up both machines from the thumb drives.

Once Fedora live is booted up, open a terminal on each machine and run:

```
sudo -i
```

Use these rooted terminals for all following steps.

Now that Fedora live is running on both machines, we'll set up the destination machine first.

---

## Step 2. Prepare the destination machine to receive the image

On the destination machine, gather two pieces of information, the destination machine's IP and the path to the disk.

### The destination machine's *wired* IP address

To find *wired* IP address, use either use `ip addr` or Settings / Network.  Once you find it, go to the *source machine* and run `export DEST_IP="1.2.3.4"` but replace `1.2.3.4` with the IP you found.  Then go back to the destination machine.

### The path to the disk we're going to write the image onto

To find the path to the disk, run:

```
parted -l
```

You'll see something like this:

```
Model: SAMSUNG MZVLB256HAHQ-000L7 (nvme)
Disk /dev/nvme0n1: 256GB
Sector size (logical/physical): 512B/512B
Partition Table: msdos
Disk Flags:

Number  Start   End     Size    Type     File system  Flags
 1      1049kB  1075MB  1074MB  primary  ext4         boot
 2      1075MB  256GB   255GB   primary
```

The bit we're looking for is on the second line, `/dev/nvme0n1`.  If multiple disks appear, make sure to choose the right one.

Put it into an environment variable.

```
export DEST_DISK="/dev/nvme0n1"
```

The last step for the destination machine is to open the door and wait for the image to be sent.

```
nc -l 1234 | dd bs=16M of=$DEST_DISK status=progress
```

This starts a netcat server listening on port 1234.  It then pipes any data sent to the netcat server directly onto the disk.  Now we just need to send the data.

---

## Step 3. Send the image from the source machine

On the source machine, we only need one piece of information: the path to the disk.  Use the same `parted -l` command from above to find it.  On my system, it was `/dev/nvme0n1`.  As before, save this in a variable.

```
export SOURCE_DISK=/dev/nvme0n1
```

The final step.  This command will send every bit from the source machine's disk across the network to the destination machine, where the waiting netcat server will write it to the destination machine's disk.

This would be a good point to stop and make sure you understand every step thus far and (above all) make sure you're writing this data to the correct disk.  When you're ready:

```
dd bs=16M if=$SOURCE_DISK | nc $DEST_IP 1234
```

The destination machine will begin displaying statistics about the data as it streams in.

---

## Step 4. Rejoice

On my 256 gig disk, this ran at about 88 MiB/s, roughly 75% of the theoretical max for a 1 Gbps network.  It took only 48 minutes to complete.

![image of the console after transfer completes]( ./complete.jpg )

Having nearly saturated the network, I'm quite sure this was the fastest way I could have cloned the disk using generalized tools.  I'm sure there are faster ways with specialized hardware or software, but who has time for that?  I do wonder whether using compression would have increased the overall speed, or instead created a new CPU/RAM bottleneck.

Happy cloning.
