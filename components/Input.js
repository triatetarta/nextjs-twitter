import {
  CalendarIcon,
  ChartBarIcon,
  EmojiHappyIcon,
  PhotographIcon,
  XIcon,
} from "@heroicons/react/outline";
import { useRef, useState } from "react";
import { db, storage } from "../firebase";
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { signOut, useSession } from "next-auth/react";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import { emojiList } from "../constants/data";
import { useSelector, useDispatch } from "react-redux";
import { setEmojiModalClose, setEmojiModalOpen } from "../redux/modalSlice";

function Input() {
  const { data: session } = useSession();
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const filePickerRef = useRef(null);
  const [emojis, setEmojis] = useState(emojiList);
  const { emojiModalOpen } = useSelector((state) => state.modal);

  const dispatch = useDispatch();

  const addImageToPost = (e) => {
    const reader = new FileReader();
    if (e.target.files[0]) {
      reader.readAsDataURL(e.target.files[0]);
    }

    reader.onload = (readerEvent) => {
      setSelectedFile(readerEvent.target.result);
    };
  };

  const sendPost = async () => {
    if (loading) return;
    setLoading(true);

    const docRef = await addDoc(collection(db, "posts"), {
      id: session.user.uid,
      username: session.user.name,
      userImg: session.user.image,
      tag: session.user.tag,
      text: input,
      timestamp: serverTimestamp(),
    });

    const imageRef = ref(storage, `posts/${docRef.id}/image`);

    if (selectedFile) {
      await uploadString(imageRef, selectedFile, "data_url").then(async () => {
        const downloadURL = await getDownloadURL(imageRef);
        await updateDoc(doc(db, "posts", docRef.id), {
          image: downloadURL,
        });
      });
    }

    setLoading(false);
    setInput("");
    setSelectedFile(null);
    dispatch(setEmojiModalClose());
  };

  const addEmoji = (emj) => {
    if (input !== "") {
      setInput(input + emj);
    } else {
      setInput(emj);
    }
  };

  return (
    <div
      className={`border-b border-gray-700 p-3 flex space-x-3 overflow-y-scroll scrollbar-hide ${
        loading && "opacity-60"
      }`}
    >
      <img
        src={session.user.image}
        alt=''
        className='h-11 w-11 rounded-full cursor-pointer'
        onClick={signOut}
      />
      <div className='divide-y divide-gray-700 w-full'>
        <div className={`${selectedFile && "pb-7"} ${input && "space-y-2.5"}`}>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="What's happening?"
            rows='2'
            className='bg-transparent outline-none text-mainWhite text-lg placeholder-gray-500 placeholder:font-normal tracking-wide w-full min-h-[50px]'
            style={{ resize: "none" }}
          />

          {selectedFile && (
            <div className='relative'>
              <div
                className='absolute w-8 h-8 bg-[#15181c] hover:bg-[#272c26] bg-opacity-75 rounded-full flex items-center justify-center top-1 left-1 cursor-pointer transition-colors duration-200'
                onClick={() => setSelectedFile(null)}
              >
                <XIcon className='text-white h-5' />
              </div>
              <img
                src={selectedFile}
                alt='file preview'
                className='rounded-2xl max-h-80 object-contain'
              />
            </div>
          )}
        </div>
        {!loading && (
          <div className='flex items-center justify-between pt-2.5'>
            <div className='flex items-center space-x-1'>
              <div
                className='icon'
                onClick={() => filePickerRef.current.click()}
              >
                <PhotographIcon className='text-[#1d9bf0] h-[20px]' />
                <input
                  type='file'
                  ref={filePickerRef}
                  hidden
                  onChange={addImageToPost}
                />
              </div>

              <div className='icon rotate-90'>
                <ChartBarIcon className='text-primaryBlue h-[20px]' />
              </div>

              <div
                className='icon relative'
                onClick={(e) => {
                  e.stopPropagation();
                  emojiModalOpen
                    ? dispatch(setEmojiModalClose())
                    : dispatch(setEmojiModalOpen());
                }}
              >
                <EmojiHappyIcon className='text-primaryBlue h-[20px]' />
              </div>

              <div className='icon'>
                <CalendarIcon className='text-primaryBlue h-[20px]' />
              </div>

              {emojiModalOpen && (
                <div className='emojiModal bg-mainBg absolute top-[180px] -ml-[40px] w-[280px] rounded-lg flex flex-wrap p-4 border border-gray-700'>
                  {emojis.map((emj, index) => {
                    return (
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          addEmoji(emj.emoji);
                        }}
                        className='text-lg hover:bg-mainWhite/10 hover:bg-opacity-10 rounded-full cursor-pointer w-[40px] h-[40px] flex items-center justify-center'
                        key={emj.id}
                      >
                        {emj.emoji}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
            <button
              className='bg-primaryBlue text-white rounded-full px-4 py-1.5 font-bold shadow-md hover:bg-hoverBlue disabled:hover:bg-primaryBlue disabled:opacity-50 disabled:cursor-default'
              disabled={!input && !selectedFile}
              onClick={sendPost}
            >
              Tweet
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Input;
