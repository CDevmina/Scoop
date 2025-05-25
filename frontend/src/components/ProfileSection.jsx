import PropTypes from 'prop-types';


export default function ProfileSection({ title, children, actionButton, deleteButton, isPasswordSection }) {
  return (
    <>
      <div className="col-span-12 flex justify-between items-center mb-2">
        <div className="ProfileTitle font-heading text-[32px] text-white">
          {title}
        </div>
        {actionButton && !isPasswordSection && (
          <div className="ProfileNav font-heading text-[24px] text-white relative">
            {actionButton}
          </div>
        )}
      </div>

      <div className="col-span-8">
        {children}
      </div>

      <div className="col-span-12 relative pb-[6px]">
        {isPasswordSection && actionButton && (
          <div className="font-heading text-[24px] absolute right-0 -top-16">
            {actionButton}
          </div>
        )}
        {deleteButton && (
          <div className="font-heading text-[24px] absolute right-0 -top-16">
            {deleteButton}
          </div>
        )}
        <div className="border-b-4 border-white w-full"></div>
      </div>
    </>
  );
}

ProfileSection.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  actionButton: PropTypes.node,
  deleteButton: PropTypes.node,
  isPasswordSection: PropTypes.bool
};