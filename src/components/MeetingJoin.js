import React, { useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';

const MeetingJoin = () => {
  const { meetingId } = useParams();
  const jitsiContainerRef = useRef(null);
  const apiRef = useRef(null);

  useEffect(() => {
    function startConference() {
      const domain = 'meet.jit.si';
      const options = {
        roomName: meetingId,
        parentNode: jitsiContainerRef.current,
        width: '100%',
        height: 600,
        interfaceConfigOverwrite: {
          SHOW_JITSI_WATERMARK: false,
          SHOW_WATERMARK_FOR_GUESTS: false,
          SHOW_BRAND_WATERMARK: false,
          TOOLBAR_BUTTONS: [
            'microphone', 'camera', 'fullscreen',
            'hangup', 'chat', 'settings',
            'raisehand', 'videoquality', 'tileview'
          ],
        },
      };
      apiRef.current = new window.JitsiMeetExternalAPI(domain, options);
    }

    if (!window.JitsiMeetExternalAPI) {
      const script = document.createElement('script');
      script.src = 'https://meet.jit.si/external_api.js';
      script.async = true;
      script.onload = () => startConference();
      document.body.appendChild(script);
    } else {
      startConference();
    }

    return () => {
      if (apiRef.current) {
        apiRef.current.dispose();
        apiRef.current = null;
      }
    };
  }, [meetingId]);

  return (
    <div>
      <h2>Meeting Room: {meetingId}</h2>
      <div ref={jitsiContainerRef} style={{ height: 600, width: '100%' }} />
    </div>
  );
};

export default MeetingJoin;
