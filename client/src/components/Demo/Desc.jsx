import useEth from "../../contexts/EthContext/useEth";
import { useEffect } from "react";
import { useState } from "react";
function Desc() {
  const {
    state: { contract, web3, accounts },
  } = useEth();
  const [writers, setWriters] = useState([]);
  // eslint-disable-next-line
  const [change, setChange] = useState(false);
  useEffect(() => {
    //Listening to a event.
    const eventWrite = () => {
      contract.events
        .Write(
          (error, event) => {
            console.log(event);
          },
          (error, event) => {
            setChange((prevChange) => {
              return !prevChange;
            });
          }
        )
        .on("connected", (subscriptionId) => {
          console.log(subscriptionId);

          // console.log(change);
        });
    };

    const getPastWriteEvent = () => {
      contract
        .getPastEvents("Write", {
          filter: {
            _writer: accounts[0],
            _value: 100,
          },
          fromBlock: 0,
          toBlock: "latest",
        })
        .then((events) => {
          console.log(events);
          setWriters(events);
        });
    };
    if (contract) {
      eventWrite();
      getPastWriteEvent();
    }

    return () => {
      web3.eth.clearSubscriptions();
    };
  }, [contract, change, web3, accounts]);

  return (
    <div>
      {/* {change ? "Ok" : "Not Ok"} */}
      <p>All Writes with value 100</p>
      {writers ? (
        <ul>
          {writers.map((writer, index) => (
            <li key={index}>
              {writer.returnValues._writer + " :" + writer.returnValues._value}
            </li>
          ))}
        </ul>
      ) : (
        "No Wriers"
      )}
    </div>
  );
}

export default Desc;
