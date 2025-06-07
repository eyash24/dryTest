// components/ProjectCard.jsx
"use client"
import Image from 'next/image';

export const ProjectCard = ({ imageSrc, title, detail }) => {
  return (
    <div className="max-w-sm mx-auto bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="flex justify-center mt-4">
        <Image
          src={imageSrc}
          alt={title}
          width={200}
          height={200}
          className="rounded-lg object-cover"
        />
      </div>
      <div className="p-4 text-center">
        <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
        <p className="mt-2 text-gray-600 text-sm">{detail}</p>
      </div>
    </div>
  );
}
