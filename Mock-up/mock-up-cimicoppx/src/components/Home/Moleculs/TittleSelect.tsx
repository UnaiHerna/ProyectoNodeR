import React, { ReactNode } from 'react';

interface TitleSectionProps {
  title: string;
  additionalLabels: ReactNode;
}

const TitleSelection: React.FC<TitleSectionProps> = ({ title, additionalLabels }) => {
  return (
    <div className="w-full flex flex-row justify-between">
      <section className="self-end w-full flex flex-row justify-between">
        <h1 className="text-blue-800 mb-2 p-1 sm:text-sm md:text-medium lg:text-large xl:text-xl 2xl:text-xl font-raleway text-center">{title}</h1>
      </section>
      <section className="flex flex-row gap-4 self-end">
        {additionalLabels}
      </section>
    </div>
  );
};

export default TitleSelection;
