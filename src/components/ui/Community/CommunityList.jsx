import CommunityListItem from "./CommunityListItem";
import "./CommunityList.css"

const CommunityList = () => {
  const listItem = [
    {
      id: 1,
      tag: 2,
      title: "맨몸 운동 3분할 루틴",
      user: "나님",
      commentCount: 2,
      goal: false,
      like: 2,
      date: "2025-09-10 14:32",
    },
    {
      id: 2,
      tag: 3,
      title: "맨몸 운동 3분할 루틴",
      user: "나님",
      commentCount: 2,
      goal: false,
      like: 2,
      date: "2025-09-10 14:32",
    },
    {
      id: 3,
      tag: 2,
      title: "맨몸 운동 3분할 루틴",
      user: "나님",
      commentCount: 2,
      goal: false,
      like: 2,
      date: "2025-09-10 14:32",
    },
    {
      id: 4,
      tag: 3,
      title: "맨몸 운동 3분할 루틴",
      user: "나님",
      commentCount: 2,
      goal: true,
      like: 2,
      date: "2025-09-10 14:32",
    },
    {
      id: 5,
      tag: 2,
      title: "맨몸 운동 3분할 루틴",
      user: "나님",
      commentCount: 2,
      goal: false,
      like: 2,
      date: "2025-09-10 14:32",
    },
  ];
  return (
    <div className="community-list-container">
      {listItem.map((item) => (
        <CommunityListItem key={item.id} {...item}/>
      ))}
    </div>
  );
};

export default CommunityList;
