import {
  ChartBarIcon,
  ChatIcon,
  DotsHorizontalIcon,
  HeartIcon,
  ShareIcon,
} from "@heroicons/react/outline";
import moment from "moment";

function Comment({ comment }) {
  return (
    <div className='p-3 flex cursor-pointer border-b border-hoverGray hover:bg-hoverGray/20'>
      <img
        src={comment?.userImg}
        alt='avatar'
        className='h-11 w-11 rounded-full mr-4'
      />
      <div className='flex flex-col space-y-2 w-full'>
        <div className='flex justify-between'>
          <div className='text-textGray'>
            <div className='inline-block group'>
              <h4 className='font-bold text-mainWhite text-[15px] sm:text-base inline-block group-hover:underline'>
                {comment?.username}
              </h4>
              <span className='ml-1.5 text-sm sm:text-[15px]'>
                @{comment?.tag}{" "}
              </span>
            </div>{" "}
            ·{" "}
            <span className='hover:underline text-sm sm:text-[15px]'>
              {moment(comment?.timestamp?.toDate()).fromNow()}
            </span>
            <p className='text-mainWhite mt-0.5 max-w-lg text-[15px] sm:text-base'>
              {comment?.comment}
            </p>
          </div>
          <div className='icon group flex-shrink-0'>
            <DotsHorizontalIcon className='h-5 text-textGray group-hover:text-primaryBlue' />
          </div>
        </div>

        <div className='text-textGray flex justify-between w-10/12'>
          <div className='icon group'>
            <ChatIcon className='h-5 group-hover:text-primaryBlue' />
          </div>

          <div className='flex items-center space-x-1 group'>
            <div className='icon group-hover:bg-lightRed/10'>
              <HeartIcon className='h-5 group-hover:text-lightRed' />
            </div>
            <span className='group-hover:text-lightRed text-sm'></span>
          </div>

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
}

export default Comment;
