import "./SummaryCard.css";

function SummaryCard({ title, value, icon }) {

    return (

        <div className="summary-card">

            <div className="summary-icon">
                {icon}
            </div>

            <div>

                <h3>{title}</h3>

                <h2>{value}</h2>

            </div>

        </div>

    );

}

export default SummaryCard;