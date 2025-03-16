import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type roleInfoProp = {
  _id: string;
  company: string;
  role: string;
};

const SelcetComp = ({ roleInfo }: { roleInfo: Array<roleInfoProp> }) => {
  return (
    <Select>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder={`company ${roleInfo[0].company}`} />
      </SelectTrigger>
      <SelectContent>
        {roleInfo.map((value) => {
          return (
            <SelectItem
              value={value.company}
              key={value._id}
              className="h-12 flex flex-wrap flex-col items-center justify-center"
            >
              <div>company: {value.company}</div>
              <div>role: {value.role}</div>
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
};

export default SelcetComp;
