import React from 'react';

const CodeChefCard = ({ handle }) => {
  return (
    <div className="bg-[#212124] p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold text-white">CodeChef Stats</h3>
      <div className="mt-4">
        <iframe
          src={`https://codechef-api.vercel.app/heatmap/${handle}`}
          style={{ width: "100%", height: "200px", border: "none" }}
          title="CodeChef Heatmap"
        />
        <iframe
          src={`https://codechef-api.vercel.app/rating/${handle}`}
          style={{ width: "100%", height: "200px", border: "none" }}
          title="CodeChef Rating Graph"
        />
      </div>
    </div>
  );
};

export default CodeChefCard;
