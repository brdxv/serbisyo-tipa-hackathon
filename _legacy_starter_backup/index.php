<?php
$services = [
  ["name"=>"Morong Community Health Center","category"=>"Clinic / Healthcare","address"=>"Poblacion, Morong, Rizal","distance"=>"1.2 km","wait"=>"24 min","status"=>"Open","hours"=>"8:00 AM – 5:00 PM","score"=>"87","reliability"=>"91%","icon"=>"✚","color"=>"red","note"=>"Usually quieter after 3 PM."],
  ["name"=>"Morong Municipal Office","category"=>"Government Service","address"=>"J. Sumulong St., Morong, Rizal","distance"=>"0.8 km","wait"=>"24 min","status"=>"Open","hours"=>"8:00 AM – 5:00 PM","score"=>"87","reliability"=>"91%","icon"=>"▥","color"=>"blue","note"=>"Processing is faster in the morning."],
  ["name"=>"Rizal Family Clinic","category"=>"Clinic / Healthcare","address"=>"Morong, Rizal","distance"=>"0.7 km","wait"=>"18 min","status"=>"Open","hours"=>"8:00 AM – 5:00 PM","score"=>"90","reliability"=>"94%","icon"=>"✚","color"=>"red","note"=>"Shorter waiting time reported."],
  ["name"=>"URS Registrar","category"=>"Education Service","address"=>"URS Morong, Rizal","distance"=>"2.1 km","wait"=>"32 min","status"=>"Closes 5 PM","hours"=>"8:00 AM – 5:00 PM","score"=>"78","reliability"=>"82%","icon"=>"▱","color"=>"purple","note"=>"Bring all requirements to avoid multiple trips."],
  ["name"=>"Bayanihan Pharmacy","category"=>"Pharmacy","address"=>"Morong, Rizal","distance"=>"1.4 km","wait"=>"12 min","status"=>"Open","hours"=>"7:00 AM – 9:00 PM","score"=>"88","reliability"=>"96%","icon"=>"＋","color"=>"green","note"=>"Fast service and complete supplies."],
  ["name"=>"Teresa Water District","category"=>"Utilities","address"=>"Teresa, Rizal","distance"=>"2.8 km","wait"=>"20 min","status"=>"Open","hours"=>"8:00 AM – 5:00 PM","score"=>"85","reliability"=>"89%","icon"=>"◉","color"=>"cyan","note"=>"Bring a valid ID and latest billing statement."]
];
?>
<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>SerbisYO — Real Experiences. Better Decisions.</title>
<link rel="stylesheet" href="assets/style.css">
</head>
<body>
<header class="topbar">
  <a class="brand" href="#"><span class="brand-mark">◆</span> Serbis<span>YO</span></a>
  <form class="search" id="searchForm"><span>⌕</span><input id="searchInput" type="search" placeholder="Search a service or place..."><button type="button" id="clearSearch" aria-label="Clear search">×</button></form>
  <button class="location">⌖ <span>Morong, Rizal</span>⌄</button>
  <button class="circle" title="Notifications">♧<i></i></button>
  <div class="avatar">K</div>
</header>
<nav class="categories" aria-label="Service categories">
  <button class="category active" data-category="All">▦ All</button>
  <button class="category" data-category="Government">▤ Government</button>
  <button class="category" data-category="Clinic">✚ Clinics</button>
  <button class="category" data-category="Food">♨ Food</button>
  <button class="category" data-category="Banks">▥ Banks</button>
  <button class="category" data-category="Education">◇ Education</button>
  <button class="category quick" data-filter="open">◉ Open Now</button>
  <button class="category quick" data-sort="wait">◷ Shortest Wait</button>
  <button class="category quick" data-sort="reliability">♥ Highest Reliability</button>
  <button class="category quick" data-filter="accessible">♿ Accessible</button>
</nav>
<main class="layout">
  <section class="service-panel">
    <div class="panel-heading">
      <div><h1>Nearby Services</h1><p id="resultCount">Services around Morong, Rizal</p></div>
      <select id="sortSelect" aria-label="Sort services"><option value="nearest">Nearest</option><option value="wait">Shortest wait</option><option value="reliability">Highest reliability</option><option value="score">Highest SerbisYO score</option></select>
    </div>
    <div id="serviceList" class="service-list">
    <?php foreach ($services as $i=>$s): ?>
      <article class="service-card" data-name="<?= htmlspecialchars(strtolower($s['name'])) ?>" data-category="<?= htmlspecialchars($s['category']) ?>" data-status="<?= htmlspecialchars($s['status']) ?>" data-wait="<?= (int)$s['wait'] ?>" data-reliability="<?= (int)$s['reliability'] ?>" data-score="<?= (int)$s['score'] ?>" data-distance="<?= (float)$s['distance'] ?>">
        <div class="service-icon <?= $s['color'] ?>"><?= $s['icon'] ?></div>
        <div class="service-info">
          <div class="service-title-row"><h2><?= htmlspecialchars($s['name']) ?></h2><span class="status <?= $s['status']==='Open'?'open':'closing' ?>"><?= htmlspecialchars($s['status']) ?></span></div>
          <p class="muted"><?= htmlspecialchars($s['category']) ?></p>
          <p class="address">⌖ <?= htmlspecialchars($s['address']) ?> <span>· <?= htmlspecialchars($s['distance']) ?></span></p>
          <div class="metrics"><span>◷ <?= htmlspecialchars($s['wait']) ?> avg. wait</span><span>⬡ <?= htmlspecialchars($s['reliability']) ?> reliability</span><span class="score"><?= htmlspecialchars($s['score']) ?> <small>score</small></span></div>
          <p class="tip">✦ <?= htmlspecialchars($s['note']) ?></p>
        </div>
        <button class="save-button" title="Save service" aria-label="Save <?= htmlspecialchars($s['name']) ?>">♡</button>
        <button class="details-button" data-service="<?= $i ?>">›</button>
      </article>
    <?php endforeach; ?>
    </div>
    <div id="emptyState" class="empty-state" hidden>No services match your search. Try another keyword or reset the filters.</div>
    <div class="bottom-note"> <span>ⓘ</span> Service information and wait times are based on community contributions.</div>
  </section>
  <section class="map-panel" aria-label="Illustrative service map">
    <div class="map-controls"><button id="mapSearch">⌕ Search this area</button><button title="Map layers">▱</button><button title="My location">◎</button><div class="zoom"><button id="zoomIn">+</button><button id="zoomOut">−</button></div></div>
    <div class="map-label label-teresa">TERESA</div><div class="map-label label-morong">Morong</div><div class="map-label label-baras">Baras</div>
    <div class="road road-main"></div><div class="road road-side"></div><div class="river"></div>
    <div class="map-pin pin-one">✚</div><div class="map-pin pin-two">▤</div><div class="map-pin pin-three">＋</div><div class="map-pin pin-four">◉</div><div class="map-pin pin-five">◇</div>
    <div class="map-tooltip"><div class="tooltip-icon">✚</div><div><b>Morong Community Health Center</b><p><span class="green-text">● Open</span> · 1.2 km from center</p></div></div>
    <div class="map-scale">━━━━━━ <small>1 km</small></div>
    <div class="weather"><span>☀</span><div><b>Morong, Rizal</b><small>28°C · Mostly cloudy</small></div></div>
    <div class="map-credit">Illustrative map preview</div>
  </section>
</main>
<div class="modal-backdrop" id="modalBackdrop" hidden>
  <section class="modal" role="dialog" aria-modal="true" aria-labelledby="modalTitle">
    <button class="modal-close" id="closeModal" aria-label="Close">×</button>
    <div class="modal-kicker">SERVICE PROFILE</div><h2 id="modalTitle">Service name</h2><p id="modalCategory" class="muted"></p>
    <div class="profile-stats"><div><small>Average wait</small><b id="modalWait">—</b></div><div><small>Reliability</small><b id="modalReliability">—</b></div><div><small>SerbisYO score</small><b id="modalScore">—</b></div></div>
    <h3>Community Intelligence</h3><p class="muted">Community reports help visitors understand service quality, busy hours, and information accuracy.</p>
    <div class="busy-hours"><b>Busy hours</b><div class="bars"><?php foreach ([18,26,36,50,72,92,100,86,66,48,35,24] as $h): ?><i style="height:<?= $h ?>%"></i><?php endforeach; ?></div><div class="bar-labels"><span>8 AM</span><span>12 PM</span><span>4 PM</span><span>6 PM</span></div></div>
    <button class="primary full" id="contributeBtn">＋ Contribute an Experience</button>
  </section>
</div>
<div class="toast" id="toast" role="status"></div>
<script src="assets/app.js"></script>
</body></html>
