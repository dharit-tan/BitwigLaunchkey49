# BitwigLaunchkey49
Bitwig controller script for Novation Launchkey 49.

The Launchkey has 2 modes: basic and extended. The InControl buttons next to each of the sections of faders (sliders), knobs (pots), and (drum) pads turn extended mode on and off. If the button is lit up, extended mode is on.

Terms:
* Cursor track: selected track.
* Primary device: selected device.

Functionality:

* Pads:
  * Extended: 
  * Basic: 
* Knobs:
  * Extended: 
  * Basic: 
* Faders:
  * Extended: 
  * Basic: Track volume.
* Numbered buttons below faders:
  * Extended:
    * Knob InControl On: Solo.
    * Knob InControl Off: Mute.
  * Basic: Select track.
* Track selector:
  * Extended: Move cursor track.
  * Basic: Move track group that fader section affects (by groups of 8).
* Transport buttons: As expected.

Note: If your midi notes aren't being recognized by Bitwig, make sure your MIDI channel is set to 1 by pressing both track navigation buttons (left and right) and setting the value in the LED screen to 1.

References:

[Launchkey MK2 programmer's reference] (http://global.novationmusic.com/sites/default/files/novation/downloads/10535/launchkey-mk2-programmers-reference-guide.pdf)

[Bitwig control surface scripting guide](https://www.bitwig.com/en/community/control_scripts/installation_guide)

[Bitwig-included Launchkey script](https://github.com/bitwig/novation-launchkey/)
