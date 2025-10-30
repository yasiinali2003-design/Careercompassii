tell application "Activity Monitor"
    activate
end tell

tell application "System Events"
    tell process "Activity Monitor"
        -- Search for the process
        keystroke "f" using {command down}
        delay 0.5
        keystroke "57580"
        delay 1
        keystroke return
        delay 1
        
        -- Select the process
        key code 125 -- Down arrow to select
        delay 0.5
        
        -- Force quit
        keystroke "x" using {option down, command down}
        delay 1
        
        -- Confirm if dialog appears
        if exists button "Force Quit" of window 1 then
            click button "Force Quit" of window 1
        end if
    end tell
end tell


