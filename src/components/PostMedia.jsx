import Image from "next/image";

const PostMedia = ({ media, isPriority = false }) => {
  if (!media?.length) return null;

  const gridClassName =
    media.length === 1
      ? "grid-cols-1"
      : media.length === 2
      ? "grid-cols-2"
      : media.length === 3
      ? "grid-cols-2"
      : "grid-cols-2";

  return (
    <div
      className={`grid ${gridClassName} gap-1 sm:gap-2 mt-2 rounded-xl overflow-hidden`}
    >
      {media.map((item, index) => (
        <div
          key={item._id}
          className={`relative w-full h-full rounded-lg overflow-hidden
            ${media.length === 3 && index === 0 ? "row-span-2" : ""}
            ${
              media.length === 1
                ? "max-h-[300px] sm:max-h-[512px]"
                : "max-h-[200px] sm:max-h-[256px]"
            }`}
          style={{ aspectRatio: item.aspectRatio }}
        >
          <Image
            src={item.url}
            alt="Post content"
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
            priority={isPriority && index === 0}
            loading={isPriority && index === 0 ? "eager" : "lazy"}
          />
        </div>
      ))}
    </div>
  );
};

export default PostMedia;
