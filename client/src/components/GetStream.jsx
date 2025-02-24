// import React, { useRef } from 'react'
// export default function CreateMeet() {
//     const localVideoRef = useRef(null);
//     const openMediaDevices = async () => {
//         const constraints = {
//             'video' : true,
//             'audio' : true
//         };
//         try {
//             const stream = await navigator.mediaDevices.getUserMedia(constraints);
//             if (localVideoRef.current) {
//                 localVideoRef.current.srcObject = stream;
//             }
//         } catch(error) {
//             console.error('Error accessing media devices.', error);
//         }
//     }
//   return (
//    <div >
//     <button onClick={openMediaDevices}>Click To get Media</button>
//     <video width='200px'  ref={localVideoRef} autoPlay playsInline muted/>
//    </div>
//   )
// }
