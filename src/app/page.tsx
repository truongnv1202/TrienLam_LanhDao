"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import { Loader2 } from "lucide-react";
import LeaderCard from "@/components/LeaderCard";
import LeaderModal from "@/components/LeaderModal";
import HomeExhibitionBackground from "@/components/HomeExhibitionBackground";
import ExhibitionHeader from "@/components/ExhibitionHeader";
import ExhibitionCanvas from "@/components/ExhibitionCanvas";
import {
  EXHIBITION_TABS,
  LEADER_NAME_BY_ID,
  normalizeLeaderName,
  type ExhibitionTabDefinition,
  type ExhibitionTabId,
} from "@/lib/display-layout";
import type { Leader } from "@/types";

const DEFAULT_TAB_ID: ExhibitionTabId = "ministers";
const INACTIVITY_RESET_MS = 60_000;

function getTabLeaders(
  leaders: Leader[],
  tab: ExhibitionTabDefinition
): Leader[] {
  const byId = new Map(leaders.map((leader) => [leader.id, leader]));
  const byName = new Map(
    leaders.map((leader) => [normalizeLeaderName(leader.name), leader])
  );

  return tab.leaderIds
    .map((id) => {
      const configuredName = LEADER_NAME_BY_ID[id];
      return (
        byId.get(id) ||
        (configuredName ? byName.get(normalizeLeaderName(configuredName)) : undefined)
      );
    })
    .filter((leader): leader is Leader => Boolean(leader));
}

export default function HomePage() {
  const [leaders, setLeaders] = useState<Leader[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedLeader, setSelectedLeader] = useState<Leader | null>(null);
  const [activeTabId, setActiveTabId] = useState<ExhibitionTabId>(DEFAULT_TAB_ID);
  const idleTimerRef = useRef<number | null>(null);

  const fetchLeaders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/leaders", { cache: "no-store" });
      if (!response.ok) throw new Error("Không tải được dữ liệu");
      const data: Leader[] = await response.json();
      setLeaders(data);
    } catch {
      setError("Không thể tải danh sách lãnh đạo. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchLeaders();
  }, [fetchLeaders]);

  const resetIdleTimer = useCallback(() => {
    if (idleTimerRef.current) {
      window.clearTimeout(idleTimerRef.current);
    }

    idleTimerRef.current = window.setTimeout(() => {
      setActiveTabId(DEFAULT_TAB_ID);
      setSelectedLeader(null);
    }, INACTIVITY_RESET_MS);
  }, []);

  useEffect(() => {
    resetIdleTimer();
    const events = ["pointerdown", "mousemove", "keydown", "touchstart"];
    events.forEach((eventName) => {
      window.addEventListener(eventName, resetIdleTimer, { passive: true });
    });

    return () => {
      if (idleTimerRef.current) {
        window.clearTimeout(idleTimerRef.current);
      }
      events.forEach((eventName) => {
        window.removeEventListener(eventName, resetIdleTimer);
      });
    };
  }, [resetIdleTimer]);

  const activeTab =
    EXHIBITION_TABS.find((tab) => tab.id === activeTabId) ?? EXHIBITION_TABS[0];
  const tabLeaders = getTabLeaders(leaders, activeTab);

  const handleTabChange = (tabId: ExhibitionTabId) => {
    setActiveTabId(tabId);
    setSelectedLeader(null);
    resetIdleTimer();
  };

  return (
    <div className="exhibition-page relative h-[100dvh] overflow-hidden">
      <HomeExhibitionBackground />

      <ExhibitionCanvas>
        <ExhibitionHeader />

        {loading && (
          <div className="exhibition-loading">
            <Loader2 className="h-12 w-12 animate-spin text-[#f5d76e]" aria-label="Đang tải" />
          </div>
        )}

        {error && (
          <p className="exhibition-error">{error}</p>
        )}

        {!loading && !error && (
          <main className="exhibition-stage">
            <div className="exhibition-board">
              <nav className="exhibition-tab-list" aria-label="Chọn nhóm lãnh đạo">
                {EXHIBITION_TABS.map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    className={[
                      "exhibition-tab-button",
                      activeTab.id === tab.id ? "exhibition-tab-button-active" : "",
                    ].join(" ")}
                    aria-pressed={activeTab.id === tab.id}
                    onClick={() => handleTabChange(tab.id)}
                  >
                    <span aria-hidden>★</span>
                    {tab.label}
                    <span aria-hidden>★</span>
                  </button>
                ))}
              </nav>

              <section
                aria-label={activeTab.label}
                className={`exhibition-tab-panel exhibition-tab-panel-${activeTab.id}`}
                style={{ "--tab-columns": activeTab.columns } as CSSProperties}
              >
                {tabLeaders.map((leader) => (
                  <LeaderCard
                    key={leader.id}
                    leader={leader}
                    displayPosition={
                      activeTab.id === "ministers"
                        ? "Bộ trưởng Bộ Công an"
                        : "Thứ trưởng Bộ Công an"
                    }
                    onClick={setSelectedLeader}
                  />
                ))}
              </section>
            </div>

            {tabLeaders.length === 0 && (
              <p className="text-center text-lg text-white/75">Chưa có dữ liệu lãnh đạo.</p>
            )}
          </main>
        )}
      </ExhibitionCanvas>

      <LeaderModal
        leader={selectedLeader}
        onClose={() => setSelectedLeader(null)}
      />
    </div>
  );
}
