import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useEffect, useRef, useState } from "react";
import {
  onSnapshot,
  doc,
  addDoc,
  collection,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import { db, storage } from "../firebase";
import { useSession } from "next-auth/react";
import {
  CalendarIcon,
  ChartBarIcon,
  EmojiHappyIcon,
  PhotographIcon,
  XIcon,
} from "@heroicons/react/outline";
import { useRouter } from "next/router";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { setModalClose, setPostId } from "../redux/modalSlice";
import { emojiList } from "../constants/data";

const Modal = () => {
  const { data: session } = useSession();
  const [post, setPost] = useState();
  const [comment, setComment] = useState("");
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [showEmojis, setShowEmojis] = useState(false);
  const [emojis, setEmojis] = useState(emojiList);
  const filePickerRef = useRef(null);
  const router = useRouter();
  const { modalOpen, postId } = useSelector((state) => state.modal);

  const dispatch = useDispatch();

  useEffect(() => {
    if (postId === "") return;
    const unsubscribe = onSnapshot(doc(db, "posts", postId), (snapshot) => {
      setPost(snapshot.data());
    });

    return () => unsubscribe();
  }, [db]);

  const sendComment = async (e) => {
    e.preventDefault();

    await addDoc(collection(db, "posts", postId, "comments"), {
      comment: comment,
      username: session.user.name,
      tag: session.user.tag,
      userImg: session.user.image,
      timestamp: serverTimestamp(),
    });

    dispatch(setModalClose());
    dispatch(setPostId(""));
    setComment("");

    router.push(`/${postId}`);
  };

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
    setShowEmojis(false);
    dispatch(setModalClose());
    dispatch(setPostId(""));
  };

  const addEmoji = (emj) => {
    if (input !== "") {
      setInput(input + emj);
    } else {
      setInput(emj);
    }
  };

  const onBackgroundClick = (e) => {
    if (e.target.classList.contains("emojiModal")) return;
    setShowEmojis(false);
  };

  const onCloseHandler = () => {
    dispatch(setPostId(""));
    dispatch(setModalClose());
  };

  return (
    <Transition.Root show={modalOpen} as={Fragment}>
      <Dialog
        as='div'
        className='fixed z-50 inset-0 pt-8 select-none'
        onClose={onCloseHandler}
      >
        <div className='flex items-start justify-center min-h-[800px] sm:min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0'>
          <Transition.Child
            as={Fragment}
            enter='ease-out duration-300'
            enterFrom='opacity-0'
            enterTo='opacity-100'
            leave='ease-in duration-200'
            leaveFrom='opacity-100'
            leaveTo='opacity-0'
          >
            <Dialog.Overlay className='fixed inset-0 bg-[#5b7083] bg-opacity-40 transition-opacity'>
              {showEmojis && (
                <div className='emojiModal bg-mainBg absolute top-[320px] left-1/2 -ml-[40px] w-[280px] rounded-lg flex flex-wrap p-4 border border-gray-700 z-50 transform -translate-x-1/2'>
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
            </Dialog.Overlay>
          </Transition.Child>

          <Transition.Child
            as={Fragment}
            enter='ease-out duration-300'
            enterFrom='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
            enterTo='opacity-100 translate-y-0 sm:scale-100'
            leave='ease-in duration-200'
            leaveFrom='opacity-100 translate-y-0 sm:scale-100'
            leaveTo='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
          >
            <div
              onClick={(e) => onBackgroundClick(e)}
              className='inline-block align-bottom bg-mainBg rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-xl sm:w-full'
            >
              <div className='flex items-center px-1.5 py-2 border-b border-hoverGray'>
                <div
                  className='hoverAnimation w-9 h-9 flex items-center justify-center xl:px-0'
                  onClick={() => {
                    dispatch(setPostId(""));
                    dispatch(setModalClose());
                  }}
                >
                  <XIcon className='h-[22px] text-mainWhite' />
                </div>
              </div>
              <div className='flex px-4 pt-5 pb-2.5 sm:px-6'>
                <div className='w-full'>
                  {postId !== "" && (
                    <div className='text-textGray flex gap-x-3 relative'>
                      <span className='w-0.5 h-full z-[-1] absolute left-5 top-11 bg-textGray' />
                      <img
                        src={post?.userImg}
                        alt=''
                        className='h-11 w-11 rounded-full'
                      />
                      <div>
                        <div className='inline-block group'>
                          <h4 className='font-bold text-mainWhite inline-block text-[15px] sm:text-base'>
                            {post?.username}
                          </h4>
                          <span className='ml-1.5 text-sm sm:text-[15px]'>
                            @{post?.tag}{" "}
                          </span>
                        </div>{" "}
                        ·{" "}
                        <span className='hover:underline text-sm sm:text-[15px]'>
                          {moment(post?.timestamp?.toDate()).fromNow()}
                        </span>
                        <p className='text-mainWhite text-[15px] sm:text-base'>
                          {post?.text}
                        </p>
                      </div>
                    </div>
                  )}

                  <div className='mt-7 flex space-x-3 w-full'>
                    <img
                      src={session.user.image}
                      alt=''
                      className='h-11 w-11 rounded-full'
                    />
                    <div className='flex-grow mt-2'>
                      <div
                        className={`${selectedFile && "pb-7"} ${
                          input && "space-y-2.5"
                        }`}
                      >
                        <textarea
                          value={postId !== "" ? comment : input}
                          onChange={(e) =>
                            postId !== ""
                              ? setComment(e.target.value)
                              : setInput(e.target.value)
                          }
                          placeholder={`${
                            postId !== ""
                              ? "Tweet your reply"
                              : "What's happening?"
                          }`}
                          rows='2'
                          className='bg-transparent outline-none text-mainWhite text-lg placeholder-textGray tracking-wide w-full min-h-[80px]'
                          style={{
                            resize: "none",
                          }}
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

                      <div className='flex items-center justify-between pt-2.5'>
                        <div className='flex items-center'>
                          <div
                            onClick={() => filePickerRef.current.click()}
                            className='icon'
                          >
                            <PhotographIcon className='text-primaryBlue h-[22px]' />
                            <input
                              type='file'
                              ref={filePickerRef}
                              hidden
                              onChange={addImageToPost}
                            />
                          </div>

                          <div className='icon rotate-90'>
                            <ChartBarIcon className='text-primaryBlue h-[22px]' />
                          </div>

                          <div
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowEmojis(!showEmojis);
                            }}
                            className='icon'
                          >
                            <EmojiHappyIcon className='text-primaryBlue h-[22px]' />
                          </div>

                          <div className='icon'>
                            <CalendarIcon className='text-primaryBlue h-[22px]' />
                          </div>
                        </div>
                        <button
                          className='bg-primaryBlue text-white rounded-full px-4 py-1.5 font-bold shadow-md hover:bg-hoverBlue disabled:hover:bg-primaryBlue disabled:opacity-50 disabled:cursor-default'
                          type='submit'
                          onClick={postId !== "" ? sendComment : sendPost}
                          disabled={postId !== "" ? !comment.trim() : !input}
                        >
                          {postId !== "" ? "Reply" : "Tweet"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default Modal;
