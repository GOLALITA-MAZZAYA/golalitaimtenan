import { useEffect, useState } from "react";
import Modal from "./Modal";
import ModalListItem from "./ModalListItem";
import ModalTitle from "./ModalTitle";
import ModalSearch from "./ModalSearch";
import SubmitBtn from "./SubmitBtn";

const defaultModalText = {
   mainTitle: 'Main title',
   searchPlaceholder: "Search ...",
   submitText: 'Apply Filters'
}

const ModalSelect = ({fetchData, onSubmit, renderItem, renderSelect, renderHeader, renderFooter, modalText = defaultModalText, modalKeyName}) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const getData = async () => {
    try{
        setLoading(true);

        const data = await fetchData();

        if(data?.length){
            setData(data)
        }

    }catch(err){
      console.log(err, 'ModalSelect fetch data error')
    }finally{
      setLoading(false);
    }

  };

  useEffect(() => {
    getData();
  }, []);


  return (
    <Modal
      modalKeyName={modalKeyName}
      renderTitle={(props) => <ModalTitle {...props} title={modalText.mainTitle}/> }
      renderHeader={(props) => <ModalSearch {...props} placeholder={modalText.searchPlaceholder}/>}
      renderSelect={renderSelect}
      renderItem={ModalListItem}
      renderFooter={(props) => <SubmitBtn {...props} title={modalText.submitText}/>}
      options={data}
      onSubmit={onSubmit}
      single
      loading={loading}
    />
  );
};

export default ModalSelect;
