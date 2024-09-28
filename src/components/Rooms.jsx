import React from "react";
import { useParams } from "react-router-dom";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";

function Rooms() {
  const { roomId } = useParams();

  const myMeeting = async (element) => {
    const appID = 475004546;
    const serverSecret = "2f40295e6d063200d5ee2b3350c17ee6";
    const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
      appID,
      serverSecret,
      roomId,
      Date.now().toString(),
      "Abhishek"
    );

    const zc = ZegoUIKitPrebuilt.create(kitToken);
    zc.joinRoom({
        container: element,
        sharedLinks: [
            {
                name:'Copy Link',
                url: `http://localhost:3000/room/${roomId}`
            }
        ],
        scenario:{
            mode: ZegoUIKitPrebuilt.OneONoneCall,
        },
        showScreenSharingButton:true,
    })
  };

  return <div>
    <div ref={myMeeting}/>
  </div>;
}

export default Rooms;
