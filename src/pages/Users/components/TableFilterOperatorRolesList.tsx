import React, { useState } from 'react';
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from '@mui/material';
import { GridFilterInputValueProps } from '@mui/x-data-grid';

export default function TableFilterOperatorRolesList({
  item,
  applyValue,
}: GridFilterInputValueProps) {
  const [value, setValue] = useState((item.value as number) ?? -1);

  const handleSelectChange = (e: SelectChangeEvent<number>) => {
    setValue(e.target.value as number);
    applyValue({ ...item, value: e.target.value as number });
  };
  return (
    <FormControl variant="standard" sx={{ minWidth: 70 }}>
      <InputLabel id="demo-simple-select-standard-label">Role</InputLabel>
      <Select
        value={value}
        onChange={(e) => handleSelectChange(e)}
        label="Role"
      >
        <MenuItem value={-1}>
          <em>None</em>
        </MenuItem>
        <MenuItem value={1}>Admin</MenuItem>
        <MenuItem value={2}>User</MenuItem>
      </Select>
    </FormControl>
  );
}
