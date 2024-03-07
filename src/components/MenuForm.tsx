import { IonCard, IonCardHeader, IonCardSubtitle, IonCardContent, IonItem, IonInput, IonButton } from "@ionic/react";
import { upload } from "../data/menus";
interface MenuFormProps {
    onSubmit: () => void;
    label: string;
    handleLabelChange: (event: any) => void;
    onFileChange: (event: any) => void;
    shouldDisable: boolean;
}
const MenuForm: React.FC<MenuFormProps> = ({ onSubmit, label, handleLabelChange, onFileChange, shouldDisable }) => {
    // const [label, setLabel] = useState<string>('');
    // const [file, setFile] = useState<File>();
    // const [menu, setMenu] = useState<any>({});
    
    return (
        <IonCard>
          <IonCardHeader>
            <IonCardSubtitle>Upload a new image</IonCardSubtitle>
          </IonCardHeader>
    
          <IonCardContent className='bg-inherit'>
            <form onSubmit={onSubmit} encType="multipart/form-data">
              <IonItem>
                <IonInput
                  value={label}
                  placeholder='Label'
                  onIonInput={handleLabelChange}
                  type="text"
                  aria-label="Label"
                  className='pl-4'
                  required
                />
              </IonItem>
              <IonItem>
                <input className='bg-inherit w-full p-4 border rounded-md' type="file" onChange={ev => onFileChange(ev)}></input>
              </IonItem>
    
              <IonButton type="submit" expand="block" className="mt-4" hidden={!label} disabled={shouldDisable}>
                Submit
              </IonButton>
            </form>
          </IonCardContent>
        </IonCard>
    
      );

}

export default MenuForm;