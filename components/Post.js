import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  setDoc,
} from "@firebase/firestore";
import {
  ChartBarIcon,
  ChatIcon,
  DotsHorizontalIcon,
  HeartIcon,
  ShareIcon,
  SwitchHorizontalIcon,
  TrashIcon,
} from "@heroicons/react/outline";
import {
  HeartIcon as HeartIconFilled,
  ChatIcon as ChatIconFilled,
} from "@heroicons/react/solid";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import moment from "moment";
import { db } from "../firebase";
import { useDispatch } from "react-redux";
import { setModalOpen, setPostId } from "../redux/modalSlice";

const Post = ({ id, post, postPage }) => {
  const { data: session } = useSession();
  const [comments, setComments] = useState([]);
  const [likes, setLikes] = useState([]);
  const [liked, setLiked] = useState(false);
  const router = useRouter();

  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(
        collection(db, "posts", id, "comments"),
        orderBy("timestamp", "desc")
      ),
      (snapshot) => setComments(snapshot.docs)
    );

    return () => {
      unsubscribe();
    };
  }, [db]);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "posts", id, "likes"),
      (snapshot) => setLikes(snapshot.docs)
    );

    return () => unsubscribe();
  }, [db, id]);

  useEffect(
    () =>
      setLiked(
        likes.findIndex((like) => like.id === session?.user?.uid) !== -1
      ),
    [likes]
  );

  const likePost = async () => {
    if (liked) {
      await deleteDoc(doc(db, "posts", id, "likes", session.user.uid));
    } else {
      await setDoc(doc(db, "posts", id, "likes", session.user.uid), {
        username: session.user.name,
      });
    }
  };

  return (
    <div
      className='p-3 flex cursor-pointer border-b border-gray-700 hover:bg-hoverGray/20 transition-colors duration-200 ease-out'
      onClick={() => router.push(`/${id}`)}
    >
      {!postPage && (
        <img
          src={post?.userImg}
          alt='avatar'
          className='h-11 w-11 rounded-full mr-4'
        />
      )}
      <div className='flex flex-col space-y-2 w-full'>
        <div className={`flex ${!postPage && "justify-between"}`}>
          {postPage && (
            <img
              src={post?.userImg}
              alt='Profile Pic'
              className='h-11 w-11 rounded-full mr-4'
            />
          )}
          <div className='text-textGray'>
            <div className='inline-block group'>
              <h4
                className={`font-bold text-[15px] sm:text-base text-mainWhite group-hover:underline ${
                  !postPage && "inline-block"
                }`}
              >
                {post?.username}
              </h4>
              <span
                className={`text-sm sm:text-[15px] ${!postPage && "ml-1.5"}`}
              >
                @{post?.tag}
              </span>
            </div>
            <span className='mx-2 font-bold'>·</span>
            <span className='hover:underline text-sm sm:text-[15px]'>
              {moment(post?.timestamp?.toDate()).fromNow()}
            </span>
            {!postPage && (
              <p className='text-mainWhite text-[15px] sm:text-base mt-0.5'>
                {post?.text}
              </p>
            )}
          </div>
          <div className='icon group flex-shrink-0 ml-auto'>
            <DotsHorizontalIcon className='h-5 text-textGray group-hover:text-primaryBlue' />
          </div>
        </div>
        {postPage && (
          <p className='text-mainWhite mt-0.5 text-xl'>{post?.text}</p>
        )}
        <img
          src={post?.image}
          alt=''
          className='rounded-2xl max-h-[700px] object-cover mr-2'
        />
        <div
          className={`text-textGray flex justify-between w-10/12 ${
            postPage && "mx-auto"
          }`}
        >
          <div
            className='flex items-center space-x-1 group'
            onClick={(e) => {
              e.stopPropagation();
              dispatch(setPostId(id));
              dispatch(setModalOpen());
            }}
          >
            <div className='icon group-hover:bg-primaryBlue group-hover:bg-opacity-10'>
              <ChatIcon className='h-5 group-hover:text-primaryBlue' />
            </div>
            {comments.length > 0 && (
              <span className='group-hover:text-primaryBlue text-sm'>
                {comments.length}
              </span>
            )}
          </div>

          <div
            className='flex items-center space-x-1 group'
            onClick={(e) => {
              e.stopPropagation();
              likePost();
            }}
          >
            <div className='icon group-hover:bg-lightRed/10'>
              {liked ? (
                <HeartIconFilled className='h-5 text-lightRed' />
              ) : (
                <HeartIcon className='h-5 group-hover:text-lightRed' />
              )}
            </div>
            {likes.length > 0 && (
              <span
                className={`group-hover:text-lightRed text-sm ${
                  liked && "text-lightRed"
                }`}
              >
                {likes.length}
              </span>
            )}
          </div>

          {session.user.uid === post?.id ? (
            <div
              className='flex items-center space-x-1 group'
              onClick={(e) => {
                e.stopPropagation();
                deleteDoc(doc(db, "posts", id));
                router.push("/");
              }}
            >
              <div className='icon group-hover:bg-lightRed/10'>
                <TrashIcon className='h-5 group-hover:text-lightRed' />
              </div>
            </div>
          ) : (
            <div className='flex items-center space-x-1 group'>
              <div className='icon group-hover:bg-lightGreen/10'>
                <SwitchHorizontalIcon className='h-5 group-hover:text-lightGreen' />
              </div>
            </div>
          )}

          <div className='icon group'>
            <ShareIcon className='h-5 group-hover:text-primaryBlue' />
          </div>
          <div className='icon group'>
            <ChartBarIcon className='h-5 group-hover:text-primaryBlue' />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Post;
