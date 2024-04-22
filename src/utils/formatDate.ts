import dayjs, { Dayjs } from 'dayjs';

import { DateFormat } from '../types/dateFormat';

export const formatDate = (
  date: Dayjs | Date | null | undefined,
  format: keyof typeof DateFormat = 'Standard',
) => (date ? dayjs(date).format(DateFormat[format]) : '');
