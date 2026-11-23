/* Labels emitted by the existing board and Analytics renderers. Keep DOM structure and data intact. */
(() => {
  const glossary = {
    "产出分析":"Production Analytics","主要":"Main","全部":"All","达成率":"Attainment","首小时":"First hour",
    "每日达成率":"Daily Attainment","每日Attainment":"Daily Attainment",
    "AI 助手":"AI assistant","AI助手":"AI assistant","主要线体":"Main lines","其他":"Other",
    "产出分析统一使用成品线口径：Pro.1 全部 6 条，Pro.2 为 Final A-D，Pro.3 为 Welding A-D，Pro.4 和 Pro.5 为全部线体。过程线不会重复计入成品产量。":"Finished-product scope: all 6 Pro.1 lines, Final A–D in Pro.2, Welding A–D in Pro.3, and all Pro.4 and Pro.5 lines. Process lines are excluded from finished totals.",
    "最大欠产贡献":"Largest shortfall","缺口":"Shortfall","改善信号":"Improvement signal",
    "暂未识别到明确的环比改善":"No clear improvement over the previous period",
    "连续风险":"Sustained risk","当前范围无连续低达成记录":"No consecutive days of low attainment in this scope",
    "当前范围未形成正常段欠产":"No normal-period shortfall in this scope",
    "正常段达成":"Normal-period attainment","当日总产出":"Daily total output","夜班总产出":"Night-shift total output",
    "OT效率达成":"Overtime efficiency attainment","全天总产出":"Workday total output",
    "已录入的人数会保留,开始产生加班产出后自动计算加班效率":"Overtime efficiency is calculated once overtime output is available.",
    "白班加班效率 = 加班产出 ÷ 加班人数 ÷ 加班已过时长":"Day-shift overtime efficiency = overtime output ÷ overtime headcount ÷ elapsed overtime hours",
    "夜班加班效率 = 加班产出 ÷ 加班人数 ÷ 加班已过时长":"Night-shift overtime efficiency = overtime output ÷ overtime headcount ÷ elapsed overtime hours",
    "(封顶 3h,进行中实时计算,避免整段稀释);":" (up to 3 hours); ",
    "(封顶 2h)。加班效率达成 = 加班效率 ÷ 正常效率。人数按车间填报(顶栏「人数填报」)，保存到云端并通过实时流/轮询同步到其他设备。数据10分钟一档，历史数据按现有归档机制读取。":" (up to 2 hours). Overtime attainment = overtime efficiency ÷ normal efficiency. Headcount is recorded by workshop. The history view reads archived snapshots.",
    "填写":"Enter","人数 · 修改后实时同步":" headcount · Updates sync when saved","历史日 · 数据只读,人数沿用该日提报":"Historical day · read-only reported headcount",
    "修改后实时同步":"Updates sync when saved","白班正常":"Day-shift normal","白班加班":"Day-shift overtime",
    "夜班正常":"Night-shift normal","夜班加班":"Night-shift overtime","全天正常":"Workday normal","全天加班":"Workday overtime",
    "白班加班时段尚未开始":"Day-shift overtime has not started","夜班加班时段尚未开始":"Night-shift overtime has not started",
    "全天加班时段尚未开始":"Overtime has not started",
    "白班正常 vs 加班日产出趋势":"Day shift · daily normal vs overtime output",
    "夜班正常 vs 加班日产出趋势":"Night shift · daily normal vs overtime output",
    "全天正常 vs 加班日产出趋势":"Full workday · daily normal vs overtime output",
    "欠产最大的生产日":"Workdays with the largest shortfall","日低于 90%":"days below 90%","达成":"Attainment","时长":"duration",
    "车间产出分析":"Workshop production analytics","正常 vs 加班时段产出":"normal vs overtime output",
    "返回主看板":"Back to dashboard","就绪":"Ready","选择分析日期":"Select analysis date",
    "填报各车间人数":"Enter workshop headcount","人数填报":"Headcount","关闭人数填报":"Close headcount",
    "班次视图":"Shift view","选择班次":"Select shift","选择班次口径":"Select shift scope",
    "白班":"Day shift","夜班":"Night shift","全天":"Full workday","实时":"Live","历史":"History",
    "线体":"Lines","未映射":"Unmapped","条":" lines","人":" people","线":" lines","天":" days",
    "班次效率专题":"Shift efficiency","当前班次出勤、正常效率与加班效率对比":"Attendance, normal and overtime efficiency for this shift",
    "正常人均小时效率":"Normal units per person-hour","加班人均小时效率":"Overtime units per person-hour",
    "加班效率达成":"Overtime efficiency attainment","本班投入人数":"Shift headcount","件/人·时":"units/person-hour",
    "件":" units","正常产出":"Normal output","加班产出":"Overtime output","正常段计划":"Normal plan",
    "正常人数":"Normal headcount","加班人数":"Overtime headcount","出勤人数":"attendance",
    "正常效率":"Normal efficiency","加班效率":"Overtime efficiency","效率对比":"Efficiency comparison",
    "正常时段":"Normal period","加班时段":"Overtime period","正常段":"Normal period","加班段":"Overtime period",
    "加班时段尚未开始":"Overtime has not started","先填写正常人数和加班人数":"Enter normal and overtime headcount",
    "暂无提报人数 - 点击下方填报表格填入":"No headcount reported. Enter it in the form below.",
    "正常/加班":"Normal / overtime","正常":"Normal","加班":"Overtime","基准":"Baseline","待填":"Pending",
    "按已过时长":"based on elapsed time","已过":"Elapsed","标准":"standard","工时":"hours","未开始":"Not started",
    "正常效率按 8h":"Normal efficiency uses 8 h","加班效率按已过时长":"Overtime efficiency uses elapsed time",
    "白班完整工作日汇总":"Full workday totals","晚班":"Night shift","加班按班次有效工时合并":"Overtime uses combined effective shift hours",
    "车间 · 线体产出明细":"Workshop and line output","车间效率按填报人数计算 · 点击车间行展开线体产出":"Efficiency uses reported headcount. Select a workshop to see its lines.",
    "正常 vs 加班日产出趋势":"daily normal vs overtime output","选择趋势周期":"Select trend period",
    "正常产出与加班产出的每日趋势图":"Daily normal and overtime output chart",
    "班次人数对比":"Shift headcount comparison","各车间正常人数与加班人数对比图":"Workshop headcount by period",
    "数据口径说明":"Calculation notes","选择历史日期":"Select history date","数据加载中":"Loading data",
    "历史产出经营分析":"Historical Production Analytics","从结果看趋势，从差距找到重点线体":"Compare output trends and identify shortfalls by line.",
    "静态归档 · 不增加数据库流量":"Archived snapshots","实时看板 · 随生产同步":"Live dashboard snapshot",
    "导出 Excel":"Export Excel","历史分析筛选":"History filters","分析层级":"Analysis scope","全厂":"All workshops",
    "全部线体":"All lines","线体钻取":"Production line","班次口径":"Shift","分析周期":"Period","今日 · 实时":"Today · snapshot",
    "今日实时":"Today · snapshot","单日":"One day","近7日":"Last 7 days","近14日":"Last 14 days","近30日":"Last 30 days",
    "纳入部分归档":"Include partial snapshots","过滤部分归档":"Exclude partial snapshots",
    "完整":"Complete","可比":"Comparable","部分归档":"Partial snapshot","部分":"Partial","过期源":"Stale source",
    "过期源不计入":"Stale snapshots excluded","无可用日期":"No dates available","当前":"Current","回看至":"Through",
    "数据取自实时看板":"Source: dashboard snapshot","更新":"Updated","正在同步":"Syncing","与生产看板一致":"Matches the dashboard",
    "产出与计划趋势":"Output vs plan over time","正常段欠产贡献":"Normal-period shortfall",
    "按计划减正常产出计算，不把加班产出冲抵正常段差距":"Normal plan minus normal output. Overtime is excluded.",
    "历史正常产出、加班产出与正常段计划趋势图":"Normal output, overtime and plan history",
    "正常段欠产贡献排行图":"Normal-period shortfall ranking","按计划减正常产出计算 · 展示前 6 项":"Normal plan minus output · Top 6",
    "线体经营矩阵":"Line performance matrix","按车间分类查看成品线的产出、达成、波动和连续风险":"Finished-line output, attainment, variation and risk by workshop.",
    "展开矩阵":"Expand matrix","收起矩阵":"Collapse matrix","有效日":"Eligible days","总产出":"Total output","稳定性":"Stability",
    "较前日":"Vs prior day","连续":"Consecutive","车间":"Workshop",
    "指标口径与归档质量":"Metrics and snapshot quality","生产日":"Workday",
    "当日白班 + 当日上午结束的前一夜班":"Day shift and preceding overnight shift",
    "正常段产出 ÷ 正常段计划；加班产出不冲抵正常段欠产":"Normal output ÷ normal plan. Overtime does not reduce the normal-period shortfall.",
    "至少 3 个有效日的日产出变异系数":"Daily output coefficient of variation over at least 3 eligible days",
    "完整、可比日进入默认经营分析；部分归档仅在手工勾选后纳入":"Complete and comparable days are shown by default. Select Include partial snapshots to see other days.",
    "当日产出":"Daily output","周期总产出":"Period output","当日成品产量":"Daily finished output","周期成品产量":"Period finished output",
    "当日线体产出":"Daily line output","周期线体产出":"Period line output","正常段计划达成":"Normal plan attainment",
    "较前一有效日":"Vs prior eligible day","最新产出":"Latest output","至少需要 2 个有效日":"Requires 2 eligible days",
    "低于 90% 线体":"Lines below 90%","按当日正常产出/计划计算":"Daily normal output divided by plan",
    "按周期正常产出/计划汇总":"Period normal output divided by plan",
    "正在读取静态历史索引":"Loading the history index","不会访问生产数据库":"No direct production database access",
    "历史经营分析暂时不可用":"History Analytics unavailable","历史索引格式不兼容":"Incompatible history index",
    "今日实时加载失败":"Could not load today's snapshot","加载失败":"Load failed","请重试":"Try again",
    "重新加载":"Reload","未知错误":"Unknown error","无数据":"No data","旧数据":"Last available data",
    "暂无可用的完整 / 可比历史趋势":"No complete or comparable history available",
    "部分归档已自动过滤，避免不完整数据影响判断":"Partial snapshots are excluded.",
    "每日 20:40 静态归档后自动更新":"Updates after the daily 20:40 archive",
    "无OT档":"No overtime archive","未加班":"No overtime","加班中":"Overtime in progress","夜班完成":"Night shift complete",
    "运行中":"Running","早停":"Early stop","关闭":"Close","无可用数据":"No data available",
    "分析":"Analytics","效率":"Efficiency","计划":"Plan","产出":"Output","日期":"Date",
    "人员":"Staff","数量":"Count","可用":"Available","合计":"Total","小时":"hours","延迟":"Delay","保存失败":"Save failed",
    "加载中":"Loading","上升":"Up","下降":"Down","问题点":"Issues","刷新":"Refresh","详情":"Detail",
    "选择":"Select","未":"Not ","暂无":"No ","分钟":" min","分":" min","人数":"Headcount",
  };
  const translate = new RegExp(Object.keys(glossary).sort((a,b)=>b.length-a.length)
    .map(s=>s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')).join('|'),'g');
  const han=/[\p{Script=Han}]/u;
  const english=()=>document.documentElement.lang==='en';
  function localize(text) {
    return english()&&han.test(text)?text.replace(translate,match=>glossary[match]):text;
  }
  // Rendered text is restored when switching back; existing data-i18n labels
  // continue to be owned by the dashboard language controller.
  const original=new WeakMap();
  const attributes=['title','aria-label','placeholder','alt'];
  function value(node,key,before,write){
    if(!before||(!han.test(before)&&!original.has(node)))return;
    let values=original.get(node);
    if(!values){values=new Map();original.set(node,values);}
    const previous=values.get(key);
    const raw=previous?.translated===before?previous.raw:before;
    const after=localize(raw);
    if(after!==raw)values.set(key,{raw,translated:after});else values.delete(key);
    if(after!==before)write(after);
  }
  function visit(node){
    if(node.nodeType===Node.TEXT_NODE){
      const parent=node.parentElement;
      if(!parent||parent.closest('script,style,[data-i18n],#langBtn,[contenteditable]'))return;
      value(node,'text',node.data,text=>{node.data=text;});
      return;
    }
    if(node.nodeType!==Node.ELEMENT_NODE||node.matches('script,style,#langBtn,[contenteditable]'))return;
    for(const key of attributes){
      if(key==='title'&&node.hasAttribute('data-i18n-title'))continue;
      value(node,key,node.getAttribute(key),text=>node.setAttribute(key,text));
    }
    for(const child of node.childNodes)visit(child);
  }
  window.FactoryLiteBoardText=localize;
  function refresh(){if(document.body)visit(document.body);}
  new MutationObserver(mutations=>{
    for(const change of mutations){
      if(change.target===document.documentElement&&change.attributeName==='lang'){refresh();continue;}
      if(change.type==='childList')change.addedNodes.forEach(visit);
      else visit(change.target);
    }
  }).observe(document.documentElement,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:['lang',...attributes]});
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',refresh,{once:true});
  else refresh();
})();
