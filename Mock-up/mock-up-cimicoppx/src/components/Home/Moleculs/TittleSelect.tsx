import React, { ReactNode } from 'react';

interface TitleSectionProps {
  title: string;
  additionalLabels: ReactNode;
}

const TitleSelection: React.FC<TitleSectionProps> = ({ title, additionalLabels }) => {
  return (
    <div className="w-full flex flex-row justify-between">
      <section className="self-end w-full flex flex-row justify-between">
        <h3 className="text-blue-800 font-normal mb-2 text-[11pt] font-raleway">{title}</h3>
      </section>
      <section className="flex flex-row gap-4 self-end">
        {additionalLabels}
      </section>
    </div>
  );
};

export default TitleSelection;
