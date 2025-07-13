import _UsersList from "@/models/UsersList";
import _ActiveTable from "@/models/ActiveTable";
import _dayList from "@/models/dayList";
import _EventList from "@/models/eventList";
import _EventListAgr from "@/models/eventListAgr";
import _GroupsList from "@/models/GroupsList";
import _dayListNew from "@/models/dayListNew";
import { Model, Sequelize } from "sequelize";
import { ModelCtor } from "sequelize-typescript";

class SQLinitModels {
  sequelize;
  constructor (sequelize: Sequelize) {
    this.sequelize = sequelize;
  }

  initUsers(): ReturnType<typeof _UsersList> {
    const UsersList = _UsersList(this.sequelize);
    return UsersList;
  }
  
  initActive(): ReturnType<typeof _ActiveTable> {
    const ActiveTable = _ActiveTable(this.sequelize);
    return ActiveTable;
  }
  
  initDay(): ReturnType<typeof _dayList> {
    const dayList = _dayList(this.sequelize);
    return dayList;
  }
  
  initEvent(): ReturnType<typeof _EventList> {
    const EventList = _EventList(this.sequelize);
    return EventList;
  }
  
  initEventAgr(): ReturnType<typeof _EventListAgr> {
    const EventListAgr = _EventListAgr(this.sequelize);
    return EventListAgr;
  }
  
  initDayListNew(): ReturnType<typeof _dayListNew> {
    const dayListNewList = _dayListNew(this.sequelize);
    return dayListNewList
  }
  initGroups(): ReturnType<typeof _GroupsList> {
    const EventList = _GroupsList(this.sequelize);
    return EventList;
  }
}

export default SQLinitModels;
