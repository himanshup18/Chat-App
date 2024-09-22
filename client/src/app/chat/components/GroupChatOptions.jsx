import MoreVertIcon from '@mui/icons-material/MoreVert';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import DeleteIcon from '@mui/icons-material/Delete';
import { Tooltip } from '@mui/material';
import { useState } from 'react';

const GroupChatOptions = ({ currentGroupChat, handleAddMembers, handleLeaveGroup, handleDeleteGroup }) => {
  const [showMoreOption, setShowMoreOption] = useState(false);

  return (
    currentGroupChat && (
      <div>
        <MoreVertIcon
          sx={{ ":hover": { backgroundColor: "#2b2b2b", borderRadius: "50%" }, cursor: "pointer" }}
          onClick={() => setShowMoreOption(!showMoreOption)}
        />

        {showMoreOption && (
          <div className="more-option" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <Tooltip title="Add Members" arrow placement="right">
              <GroupAddIcon
                sx={{
                  cursor: 'pointer',
                  ":hover": { color: '#2b2b2b' }, // You can customize hover colors here
                }}
                onClick={handleAddMembers}
              />
            </Tooltip>

            <Tooltip title="Leave Group" arrow placement="right">
              <ExitToAppIcon
                sx={{
                  cursor: 'pointer',
                  ":hover": { color: '#2b2b2b' },
                }}
                onClick={handleLeaveGroup}
              />
            </Tooltip>

            <Tooltip title="Delete Group" arrow placement="right">
              <DeleteIcon
                sx={{
                  cursor: 'pointer',
                  ":hover": { color: '#2b2b2b' },
                }}
                onClick={handleDeleteGroup}
              />
            </Tooltip>
          </div>
        )}
      </div>
    )
  );
};

export default GroupChatOptions;
