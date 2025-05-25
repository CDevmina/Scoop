import PropTypes from "prop-types";

const CustomTable = ({ director, actors }) => {
  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full border-collapse table-fixed">
        {/* CAST Section */}
        <thead>
          <tr>
            <th className="text-4xl font-bold text-left pb-6">CAST</th>
          </tr>
        </thead>
        <tbody>
          {actors.map((actor, index) => (
            <tr key={index} className="border-b border-gray-800">
              <td className="py-4 text-base">{actor}</td>
            </tr>
          ))}
        </tbody>

        {/* TEAM Section */}
        <thead>
          <tr>
            <th className="text-4xl font-bold text-left pt-8 pb-6" colSpan="2">
              TEAM
            </th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-b border-gray-800">
            <td className="py-4 text-base text-gray-300">Directed By</td>
            <td className="py-4 text-base">{director}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

CustomTable.propTypes = {
  director: PropTypes.string.isRequired,
  actors: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default CustomTable;
