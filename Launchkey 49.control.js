loadAPI(1);

host.defineController("Novation", "Launchkey 49", "1.0", "45108550-9E02-11E2-9E96-D0AA527BA73A");
host.defineMidiPorts(2, 2);
host.addDeviceNameBasedDiscoveryPair(["Launchkey 49", "MIDIIN2 (Launchkey 49)"], ["Launchkey 49", "MIDIOUT2 (Launchkey 49)"]);
host.addDeviceNameBasedDiscoveryPair(["Launchkey 49 MIDI 1", "Launchkey 49 MIDI 2"], ["Launchkey 49 MIDI 1", "Launchkey 49 MIDI 2"]); 

load("launchkey_common.js");

function init() {
   // host.getMidiInPort(0).createNoteInput("Launchkey 49", "80????", "90????", "B001??", "D0????", "E0????");
   // host.getMidiInPort(0).createNoteInput("Launchkey Pads", "89????", "99????");

   host.getMidiInPort(0).setMidiCallback(onMidi0);
   host.getMidiInPort(1).setMidiCallback(onMidi1);

	// transport = host.createTransportSection();

 //   cursorTrack = host.createCursorTrackSection(0, 8);
 //   masterTrack = host.createMasterTrackSection(0);

 //   primaryDevice = cursorTrack.getPrimaryDevice();

 //   primaryDevice.addSelectedPageObserver(-1, function(value)
 //   {
 //      selectedPage = value;
 //   });

 //   primaryDevice.addPageNamesObserver(function()
 //   {
 //      numParameterPages = arguments.length;
 //   });

 //   trackBank = host.createTrackBankSection(8, 0, 0);

 //   for(var p=0; p<8; p++)
 //   {
 //      var modSource = primaryDevice.getModulationSource(p);
 //      modSource.addIsMappingObserver(modSourceStates.setter(p));
 //   }

 //   userControls = host.createUserControlsSection(8);

 //   for(var p=0; p<8; p++)
 //   {
 //      userControls.getControl(p).setLabel("User " + (p + 1));
 //   }

   // host.getMidiOutPort(1).sendMidi(0x9F, 0x0C, 0x7F);
   host.getMidiOutPort(1).sendMidi(159, 12, 127);

 //   updateIndications();

 //   host.scheduleTask(blinkTimer, null, 100);
}

var fastblink = true;
var blink = true;

function blinkTimer()
{
   fastblink = !fastblink;

   if (fastblink)
   {
      blink = !blink;
   }

   host.scheduleTask(blinkTimer, null, 100);
}

function updateIndications()
{
   for(var i=0; i<8; i++)
   {
      primaryDevice.getParameter(i).setIndication(incontrol_knobs);
      userControls.getControl(i).setIndication(!incontrol_knobs);
      primaryDevice.getMacro(i).getAmount().setIndication(incontrol_mix);
      trackBank.getTrack(i).getVolume().setIndication(!incontrol_mix);

   }
}

function exit()
{
   sendMidi(0x90, 0x0C, 0x00);
}

function flush()
{
   updateOutputState();
   flushOutputState();
}

function onMidi0(status, data1, data2)
{
	printMidi(status, data1, data2);
   println("channel 0");

   if (isChannelController(status))
   {
      if (data1 >= 21 && data1 <= 28)
      {
         var knobIndex = data1 - 21;

         userControls.getControl(knobIndex).set(data2, 128);
      }
      else if (data1 >= 41 && data1 <= 48)
      {
         var sliderIndex = data1 - 41;

         trackBank.getTrack(sliderIndex).getVolume().set(data2, 128);
      }
      else if (data1 == 7)
      {
         masterTrack.getVolume().set(data2, 128);
      }
      else if (data1 >= 51 && data1 <= 58)
      {
         var buttonIndex = data1 - 51;

         if (data2 == 127)
         {
            trackBank.getTrack(buttonIndex).select();
         }
      }
   }
}

var incontrol_mix = true;
var incontrol_knobs = true;
var incontrol_pads = true;

function onMidi1(status, data1, data2)
{
   printMidi(status, data1, data2);
   println("channel 1");

   if (isChannelController(status))
   {
      if (data1 >= 21 && data1 <= 28)
      {
         var knobIndex = data1 - 21;

         primaryDevice.getParameter(knobIndex).set(data2, 128);
      }
      else if (data1 >= 41 && data1 <= 48)
      {
         var sliderIndex = data1 - 41;

         primaryDevice.getMacro(sliderIndex).getAmount().set(data2, 128);
      }
      else if (data1 == 7)
      {
         cursorTrack.getVolume().set(data2, 128);
      }
      else if (data1 >= 51 && data1 <= 58)
      {
         var buttonIndex = data1 - 51;

         if (data2 == 127)
         {
            primaryDevice.getMacro(buttonIndex).getModulationSource().toggleIsMapping();
         }
      }

      if (data2 == 127)
      {
         // button presses

         if (data1 == 102)
         {
            if (incontrol_mix)
            {
               cursorTrack.selectPrevious();
            }
            else
            {
               trackBank.scrollTracksPageUp();
            }
         }
         else if (data1 == 103)
         {
            if (incontrol_mix)
            {
               cursorTrack.selectNext();
            }
            else
            {
               trackBank.scrollTracksPageDown();
            }
         }
         else if (data1 == 112)
         {
            transport.rewind();
         }
         else if (data1 == 113)
         {
            transport.fastForward();
         }
         else if (data1 == 114)
         {
            transport.stop();
         }
         else if (data1 == 115)
         {
            transport.play();
         }
         else if (data1 == 116)
         {
            transport.toggleLoop();
         }
         else if (data1 == 117)
         {
            transport.record();
         }
      }
   }

   if (MIDIChannel(status) == 0 && isNoteOn(status))
   {
      if (data1 >= 96 && data1 < 104)
      {
         var i = data1 - 96;
         primaryDevice.setParameterPage(i);
      }
      else if (data1 >= 112 && data1 < 120)
      {
         var i = data1 - 112;
         primaryDevice.getModulationSource(i).toggleIsMapping();
      }
      else if (data1 == 104)
      {
         primaryDevice.switchToPreviousPreset();
      }
      else if (data1 == 120)
      {
         primaryDevice.switchToNextPreset();
      }

      if (data1 == 13)
      {
         incontrol_knobs = data2 == 127;
         host.showPopupNotification(incontrol_knobs ? "Knobs: Parameters" : "Knobs: User Mappings");
         updateIndications();
      }
      else if (data1 == 14)
      {
         incontrol_mix = data2 == 127;
         host.showPopupNotification(incontrol_mix ? "Sliders: Macros" : "Sliders: Mixer");
         updateIndications();
      }
      else if (data1 == 15)
      {
         incontrol_pads = data2 == 127;
         host.showPopupNotification(incontrol_pads ? "Parameter Page & Modulation" : "Drum Pads");
         updateIndications();
      }
   }
}
