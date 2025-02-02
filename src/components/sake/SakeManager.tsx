"use client";

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Globe, Lock, Plus } from "lucide-react";

// 仮のデータ型定義
type SakeType = {
  id: number;
  name: { ja: string; en: string };
  sweetness: number;
  description: { ja: string; en: string };
  region: { ja: string; en: string };
  rice: { ja: string; en: string };
  polishingRate: string;
  color: string;
};

// 仮のデータ
const initialSakeList: SakeType[] = [
  {
    id: 1,
    name: { ja: "獺祭 45", en: "Dassai 45" },
    sweetness: -8,
    description: {
      ja: "山田錦を45%まで磨き上げた淡麗辛口。フルーティな香りと切れ味の良い後味が特徴。",
      en: "A dry sake polished to 45%. Features fruity aroma and crisp finish."
    },
    region: { ja: "山口県", en: "Yamaguchi" },
    rice: { ja: "山田錦", en: "Yamadanishiki" },
    polishingRate: "45%",
    color: "#EF4444"
  },
  {
    id: 2,
    name: { ja: "久保田 萬寿", en: "Kubota Manju" },
    sweetness: -5,
    description: {
      ja: "最高級純米大吟醸。繊細な香りと上品な味わい。",
      en: "Premium Junmai Daiginjo with elegant aroma and refined taste."
    },
    region: { ja: "新潟県", en: "Niigata" },
    rice: { ja: "山田錦", en: "Yamadanishiki" },
    polishingRate: "40%",
    color: "#F97316"
  }
];

export default function SakeManager() {
  const [sakeList] = useState<SakeType[]>(initialSakeList);
  const [selectedSake, setSelectedSake] = useState<SakeType | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [language, setLanguage] = useState<'ja' | 'en'>('ja');

  // 散布図のスケール調整用の定数
  const PLOT_WIDTH = 800;
  const PLOT_HEIGHT = 400;

  return (
    <div className="p-4 max-w-4xl mx-auto">
      {/* ヘッダーコントロール */}
      <div className="flex justify-between items-center mb-4">
        <Button
          variant="outline"
          onClick={() => setIsAdmin(!isAdmin)}
          className="flex items-center gap-2"
        >
          <Lock className="w-4 h-4" />
          <span>{isAdmin ? "管理者モード" : "閲覧モード"}</span>
        </Button>
        
        <Button
          variant="outline"
          onClick={() => setLanguage(language === 'ja' ? 'en' : 'ja')}
          className="flex items-center gap-2"
        >
          <Globe className="w-4 h-4" />
          <span>{language === 'ja' ? 'English' : '日本語'}</span>
        </Button>
      </div>

      {/* メインの分布図 */}
      <Card className="mb-4">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>
            {language === 'ja' ? "日本酒の甘辛分布" : "Sake Sweetness Distribution"}
          </CardTitle>
          {isAdmin && (
            <Button className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              <span>{language === 'ja' ? "新規追加" : "Add New"}</span>
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {/* 散布図 */}
          <div className="relative w-full h-96 bg-slate-50 rounded-lg">
            <svg className="w-full h-full" viewBox={`0 0 ${PLOT_WIDTH} ${PLOT_HEIGHT}`}>
              {/* 中心線 */}
              <line
                x1={PLOT_WIDTH/2}
                y1="40"
                x2={PLOT_WIDTH/2}
                y2="320"
                stroke="#CBD5E0"
                strokeWidth="2"
                strokeDasharray="4"
              />
              
              {/* プロット点 */}
              {sakeList.map((sake, index) => {
                const x = (PLOT_WIDTH/2) + sake.sweetness * 40;
                const y = 120 + (index % 2) * 80;
                return (
                  <g
                    key={sake.id}
                    transform={`translate(${x}, ${y})`}
                    onClick={() => setSelectedSake(sake)}
                    className="cursor-pointer"
                  >
                    <circle
                      r="12"
                      fill={sake.color}
                      className="transition-all duration-200 hover:opacity-80"
                      opacity={selectedSake?.id === sake.id ? "1" : "0.7"}
                    />
                    <text
                      y="30"
                      textAnchor="middle"
                      className="text-sm font-medium fill-slate-700"
                      style={{ textShadow: "0 0 8px white" }}
                    >
                      {sake.name[language]}
                    </text>
                  </g>
                );
              })}
            </svg>
            
            {/* 軸ラベル */}
            <div className="absolute bottom-4 left-8 text-lg font-semibold text-slate-700">
              {language === 'ja' ? "辛口" : "Dry"}
            </div>
            <div className="absolute bottom-4 right-8 text-lg font-semibold text-slate-700">
              {language === 'ja' ? "甘口" : "Sweet"}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 選択された日本酒の詳細 */}
      {selectedSake && (
        <Card className="border-t-4" style={{ borderColor: selectedSake.color }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: selectedSake.color }}
              />
              {selectedSake.name[language]}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <p className="text-slate-600 text-lg">
                {selectedSake.description[language]}
              </p>
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-slate-50 p-4 rounded-lg">
                  <p className="font-semibold text-slate-900">
                    {language === 'ja' ? "産地" : "Region"}
                  </p>
                  <p className="text-slate-600 mt-1">
                    {selectedSake.region[language]}
                  </p>
                </div>
                <div className="bg-slate-50 p-4 rounded-lg">
                  <p className="font-semibold text-slate-900">
                    {language === 'ja' ? "使用米" : "Rice"}
                  </p>
                  <p className="text-slate-600 mt-1">
                    {selectedSake.rice[language]}
                  </p>
                </div>
                <div className="bg-slate-50 p-4 rounded-lg">
                  <p className="font-semibold text-slate-900">
                    {language === 'ja' ? "精米歩合" : "Polishing Rate"}
                  </p>
                  <p className="text-slate-600 mt-1">
                    {selectedSake.polishingRate}
                  </p>
                </div>
                <div className="bg-slate-50 p-4 rounded-lg">
                  <p className="font-semibold text-slate-900">
                    {language === 'ja' ? "甘辛度" : "Sweetness"}
                  </p>
                  <p className="text-slate-600 mt-1">
                    {selectedSake.sweetness}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
