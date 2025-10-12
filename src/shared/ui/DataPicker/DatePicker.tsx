'use client'

import {useState, useEffect, FocusEvent} from 'react';
import {DayPicker} from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import {Input} from '../Input/Input';
import s from './DatePicker.module.scss';

type Props = {
  error?: string
  selected?: string; // строка в формате ISO (пр. "2021-01-01T00:00:00.000Z")
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  value?: string | null
  label?: string;
  labelMobile?: string;
  errorLink?: React.ReactNode;
}

function formatterDate(dateString?: string | Date, isMobile?: boolean): string {
  if (!dateString) return '00.00.0000';

  // Если дата уже в  формате "27.09.2024"
  if (typeof dateString === 'string' && dateString[2] === '.' && dateString[5] === '.') {
    return isMobile ? dateString.slice(0, 6) + dateString.slice(-2) : dateString;
  }

  // Для ISO формата или объекта Date
  const date = typeof dateString === 'string'
    ? new Date(dateString)
    : dateString;

  if (isNaN(date.getTime())) {
    return '00.00.0000';
  }
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = isMobile
    ? String(date.getFullYear()).slice(-2)
    : String(date.getFullYear());

  return `${day}.${month}.${year}`;
}

export function DatePicker({
                             selected,
                             label,
                             labelMobile,
                             error,
                             value, onChange, errorLink
                           }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  //юзеффект для ui мобилки
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleBlur = (e: FocusEvent) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsOpen(false);
    }
  };

  const handleDaySelect = (date: Date | undefined) => {
    onChange?.({target: {value: formatterDate(date, false)}} as React.ChangeEvent<HTMLInputElement>);
    setIsOpen(false);
  };

  // Преобразуем строку ISO в Date для DayPicker
  const selectedDate = selected ? new Date(selected) : undefined;
  const displayDate = formatterDate(selected, isMobile);
  const displayLabel = isMobile && labelMobile ? labelMobile : label;
  const date13YearsAgo = new Date(new Date().setFullYear(new Date().getFullYear() - 13));
  return (
    <div className={s.datePicker} onBlur={handleBlur} tabIndex={-1}>
      <div className={s.dateContainer} onClick={() => {setIsOpen(!isOpen)}}>
        <Input
            type={'text'}
            label={displayLabel}
            placeholder={displayDate}
            error={error}
            value={value!}
            readOnly
            errorLink={errorLink}
            className={s.input}

        />
        <div className={s.calendar}>
          <svg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
            <path
              d='M18 4H17V3C17 2.73478 16.8946 2.48043 16.7071 2.29289C16.5196 2.10536 16.2652 2 16 2C15.7348 2 15.4804 2.10536 15.2929 2.29289C15.1054 2.48043 15 2.73478 15 3V4H9V3C9 2.73478 8.89464 2.48043 8.70711 2.29289C8.51957 2.10536 8.26522 2 8 2C7.73478 2 7.48043 2.10536 7.29289 2.29289C7.10536 2.48043 7 2.73478 7 3V4H6C5.20435 4 4.44129 4.31607 3.87868 4.87868C3.31607 5.44129 3 6.20435 3 7V19C3 19.7956 3.31607 20.5587 3.87868 21.1213C4.44129 21.6839 5.20435 22 6 22H18C18.7956 22 19.5587 21.6839 20.1213 21.1213C20.6839 20.5587 21 19.7956 21 19V7C21 6.20435 20.6839 5.44129 20.1213 4.87868C19.5587 4.31607 18.7956 4 18 4ZM6 6H7V7C7 7.26522 7.10536 7.51957 7.29289 7.70711C7.48043 7.89464 7.73478 8 8 8C8.26522 8 8.51957 7.89464 8.70711 7.70711C8.89464 7.51957 9 7.26522 9 7V6H15V7C15 7.26522 15.1054 7.51957 15.2929 7.70711C15.4804 7.89464 15.7348 8 16 8C16.2652 8 16.5196 7.89464 16.7071 7.70711C16.8946 7.51957 17 7.26522 17 7V6H18C18.2652 6 18.5196 6.10536 18.7071 6.29289C18.8946 6.48043 19 6.73478 19 7V11H5V7C5 6.73478 5.10536 6.48043 5.29289 6.29289C5.48043 6.10536 5.73478 6 6 6ZM18 20H6C5.73478 20 5.48043 19.8946 5.29289 19.7071C5.10536 19.5196 5 19.2652 5 19V13H19V19C19 19.2652 18.8946 19.5196 18.7071 19.7071C18.5196 19.8946 18.2652 20 18 20Z'
              fill='white'
            />
            <path
              d='M8 17C8.55228 17 9 16.5523 9 16C9 15.4477 8.55228 15 8 15C7.44772 15 7 15.4477 7 16C7 16.5523 7.44772 17 8 17Z'
              fill='white'
            />
            <path
              d='M16 15H12C11.7348 15 11.4804 15.1054 11.2929 15.2929C11.1054 15.4804 11 15.7348 11 16C11 16.2652 11.1054 16.5196 11.2929 16.7071C11.4804 16.8946 11.7348 17 12 17H16C16.2652 17 16.5196 16.8946 16.7071 16.7071C16.8946 16.5196 17 16.2652 17 16C17 15.7348 16.8946 15.4804 16.7071 15.2929C16.5196 15.1054 16.2652 15 16 15Z'
              fill='white'
            />
          </svg>
        </div>
      </div>

            {isOpen && (
                 <div className={s.datePickerPopup}>
                   <DayPicker
                       mode="single"
                       selected={selectedDate}
                       onSelect={handleDaySelect}
                       weekStartsOn={1}
                       fixedWeeks
                       captionLayout="dropdown"
                       endMonth={date13YearsAgo}
                       className={s.customDayPicker}
                       modifiers={{
                         weekend: (date) => [0, 6].includes(date.getDay()),
                       }}
                       modifiersStyles={{
                         selected: {
                           backgroundColor: '#234e99',
                           borderRadius: '50%',
                         },
                         // months_dropdowns:{
                         //   border:"none",outline:"none"
                         // },
                         day_button:{
                           border:"none",
                           outline:"none"},
                         today:{},
                         weekend: {
                           color: '#cc1439',
                         },
                       }}
                   />
                </div>
            )}
        </div>
    );
}
