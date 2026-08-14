import EcoAllUser from '@/components/module/All-User/EcoAllUser';
import React from 'react';

const AllUsr = () => {
  const data = [
  {
    id: 1,
    name: "Asad",
    email: "asad@gmail.com",
  },
  {
    id: 2,
    name: "John",
    email: "john@gmail.com",
  },
];
  return (
    <div>
       <EcoAllUser/>
    </div>
  );
};

export default AllUsr;