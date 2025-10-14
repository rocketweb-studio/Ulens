'use client'
import React, {ChangeEvent, useRef, useState} from 'react';
import s from './Select.module.scss';

type DropdownProps = {
  options: string[];
  placeholder?: string;
  disabled?: boolean;
  title?: string;
  style?: object;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    propsValue?: string | null;

}

export const Select = ({
                         options,
                         title = "",
                         placeholder = "Выбрать",
                         disabled ,
                         style,
                         onChange,
                           propsValue
                       }: DropdownProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selected, setSelected] = useState<string>('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [inpVal, setInpVal] = useState<string>('');

  const handleSelect = (option: string) => {
    setSelected(option);
      setInpVal(option);
    setIsOpen(false);
    if (onChange) {
      onChange({target: {value: option}} as React.ChangeEvent<HTMLInputElement>)
    }
  };
const filteredOptions=options.filter((option: string) =>option.toLowerCase().includes(inpVal.toLowerCase().trim()));

  return (
    <div className={s.dropdown} ref={dropdownRef} style={style}>
      <label className={s.title}>{title}</label>
      <div
        className={`${s.trigger} ${disabled ? s.disabled : ""}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <input  placeholder={propsValue || selected || placeholder} className={s.input} value={inpVal}
                onChange={(e)=>setInpVal(e.target.value)}
                onClick={(e)=>setInpVal('')}
                disabled={disabled}
        />
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M5.51422 9.4583C5.51376 9.22465 5.59514 8.99821 5.74422 8.8183C5.82817 8.71704 5.93127 8.63334 6.04762 8.57199C6.16396 8.51064 6.29127 8.47284 6.42225 8.46077C6.55322 8.44869 6.6853 8.46257 6.8109 8.50162C6.9365 8.54066 7.05317 8.6041 7.15422 8.6883L12.5142 13.1683L17.8842 8.8483C17.9865 8.76524 18.1042 8.70321 18.2305 8.66577C18.3569 8.62834 18.4894 8.61625 18.6204 8.63019C18.7514 8.64413 18.8784 8.68382 18.994 8.747C19.1097 8.81017 19.2117 8.89558 19.2942 8.9983C19.3853 9.10177 19.4539 9.22293 19.4959 9.3542C19.5379 9.48546 19.5523 9.62398 19.5382 9.76108C19.5241 9.89817 19.4819 10.0309 19.4141 10.1509C19.3463 10.2708 19.2544 10.3755 19.1442 10.4583L13.1442 15.2883C12.9653 15.4354 12.7408 15.5158 12.5092 15.5158C12.2776 15.5158 12.0532 15.4354 11.8742 15.2883L5.87422 10.2883C5.7532 10.188 5.65754 10.0606 5.59499 9.91634C5.53244 9.77213 5.50477 9.61521 5.51422 9.4583Z"
            fill="white"/>
        </svg>
      </div>

      {isOpen && (
        <div className={s.options}>
          {filteredOptions.map((option, index) => (
            <div
              key={index}
              className={s.option}
              onClick={() => handleSelect(option)}
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

