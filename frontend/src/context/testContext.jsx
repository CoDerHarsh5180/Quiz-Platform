import { createContext, useContext, useEffect, useState } from "react";
import { getStructure } from "../Api/structureApi";
import { useAuth } from "./teacherContext";

const TestContext = createContext(null);

export const TestProvider = ({ children }) => {
    const [testArray, setTestArray] = useState([]);
    const { user } = useAuth();
    const [loading1, setLoading] = useState(true);
    const [sectionEditing, setSectionEditing] = useState(false);
    const [TestId, setTestId] = useState('');
    const [AddQues, setAddQues] = useState(false);
    const [sec, setSec] = useState(0);

    const openQuesAdder = (id) => {
        setTestId(id);
        setAddQues(true);
    };

    const openSectionEditor = (id, secCount) => {
        setSectionEditing(true);
        setTestId(id);
        setSec(secCount);
    };

    useEffect(() => {
        // Reset array first to avoid duplicate accumulation on re-runs
        setTestArray([]);

        if (!user) {
            setLoading(false);
            return;
        }

        const tests = user?.tests ?? [];
        console.log(tests);
        if (tests.length === 0) {
            setLoading(false);
            return;
        }

        Promise.all(tests.map((t) => getStructure(t)))
            .then((results) => {
                // ── 18. Normalize response shape ──
                // getStructure returns res.data (axios body).
                // Backend may send { data: {...} } or the object directly.
                // We normalize so consumers always use t.data._id, t.data.name etc.
                const normalized = results
                    .filter(Boolean)
                    .map((r) => (r && r.data ? r : { data: r }));
                setTestArray(normalized);
            })
            .catch((e) => console.error("Failed to fetch test structures:", e))
            .finally(() => setLoading(false));

    }, [user]);

    return (
        <TestContext.Provider value={{ testArray, loading1, sectionEditing, setSectionEditing, openSectionEditor, TestId, sec, openQuesAdder, AddQues, setAddQues }}>
            {children}
        </TestContext.Provider>
    );
};

export const useTest = () => useContext(TestContext);