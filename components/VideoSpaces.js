import { React, useEffect, useRef } from "react";
import {
  useHMSActions,
  useHMSStore,
  selectLocalPeer,
  selectCameraStreamByPeerID,
} from "@100mslive/react-sdk";

function VideoSpaces({ peer, islocal }) {
  const hmsActions = useHMSActions();
  const videoRef = useRef(null);
  const videoTrack = useHMSStore(selectCameraStreamByPeerID(peer.id));
  useEffect(() => {
    (async () => {
      if (videoRef.current && videoTrack) {
        if (videoTrack.enabled) {
          await hmsActions.attachVideo(videoTrack.id, videoRef.current);
        } else {
          await hmsActions.detachVideo(videoTrack.id, videoRef.current);
        }
      }
    })();
  }, [videoTrack]);
  return (
    <div className="h-full w-full">
      <div className="relative h-full w-full">
        <video
          ref={videoRef}
          autoPlay={true}
          playsInline
          muted={true}
          className={`h-full w-full rounded-lg" ${
            islocal ? "" : "mirror"
          }`}
        ></video>
        
      </div>
    </div>
  );
}

export default VideoSpaces;